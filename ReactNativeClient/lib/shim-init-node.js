const fs = require('fs-extra');
const { shim } = require('lib/shim.js');
const { GeolocationNode } = require('lib/geolocation-node.js');
const { FileApiDriverLocal } = require('lib/file-api-driver-local.js');
const { time } = require('lib/time-utils.js');
const {
    setLocale,
    defaultLocale,
    closestSupportedLocale
} = require('lib/locale.js');

function fetchRequestCanBeRetried(error) {
    if (!error) return false;

    // Unfortunately the error 'Network request failed' doesn't have a type
    // or error code, so hopefully that message won't change and is not localized
    if (error.message == 'Network request failed') return true;

    // request to https://public-ch3302....1fab24cb1bd5f.md failed, reason: socket hang up"
    if (error.code == 'ECONNRESET') return true;

    // OneDrive (or Node?) sometimes sends back a "not found" error for resources
    // that definitely exist and in this case repeating the request works.
    // Error is:
    // request to https://graph.microsoft.com/v1.0/drive/special/approot failed, reason: getaddrinfo ENOTFOUND graph.microsoft.com graph.microsoft.com:443
    if (error.code == 'ENOTFOUND') return true;

    // network timeout at: https://public-ch3302...859f9b0e3ab.md
    if (error.message && error.message.indexOf('network timeout') === 0)
        return true;

    // name: 'FetchError',
    // message: 'request to https://api.ipify.org/?format=json failed, reason: getaddrinfo EAI_AGAIN api.ipify.org:443',
    // type: 'system',
    // errno: 'EAI_AGAIN',
    // code: 'EAI_AGAIN' } } reason: { FetchError: request to https://api.ipify.org/?format=json failed, reason: getaddrinfo EAI_AGAIN api.ipify.org:443
    //
    // It's a Microsoft error: "A temporary failure in name resolution occurred."
    if (error.code == 'EAI_AGAIN') return true;

    return false;
}

function shimInit() {
    shim.fs = fs;
    shim.FileApiDriverLocal = FileApiDriverLocal;
    shim.Geolocation = GeolocationNode;
    shim.FormData = require('form-data');

    shim.detectAndSetLocale = function (Setting) {
        let locale = process.env.LANG;
        if (!locale) locale = defaultLocale();
        locale = locale.split('.');
        locale = locale[0];
        locale = closestSupportedLocale(locale);
        Setting.setValue('locale', locale);
        setLocale(locale);
        return locale;
    };

    const resizeImage_ = async function (filePath, targetPath) {
        const sharp = require('sharp');
        const { Resource } = require('lib/models/resource.js');

        return new Promise((resolve, reject) => {
            sharp(filePath)
                .resize(
                    Resource.IMAGE_MAX_DIMENSION,
                    Resource.IMAGE_MAX_DIMENSION,
                    {
                        fit: 'inside', // Ensures the image fits within the given dimensions
                        withoutEnlargement: true // Prevents upscaling
                    }
                )
                .toFile(targetPath)
                .then(resolve)
                .catch(reject);
        });
    };

    shim.attachFileToNote = async function (note, filePath) {
        const { Resource } = require('lib/models/resource.js');
        const { uuid } = require('lib/uuid.js');
        const { filename } = require('lib/path-utils.js');
        const mime = require('mime-types');
        const { Note } = require('lib/models/note.js');

        if (!(await fs.pathExists(filePath)))
            throw new Error(_('Cannot access %s', filePath));

        let resource = Resource.new();
        resource.id = uuid.create();
        resource.mime = mime.lookup(filePath);
        resource.title = filename(filePath);

        let targetPath = Resource.fullPath(resource);

        if (
            resource.mime == 'image/jpeg' ||
            resource.mime == 'image/jpg' ||
            resource.mime == 'image/png'
        ) {
            const result = await resizeImage_(filePath, targetPath);
        } else {
            await fs.copy(filePath, targetPath, { overwrite: true });
        }

        await Resource.save(resource, { isNew: true });

        const newNote = Object.assign({}, note, {
            body: note.body + '\n\n' + Resource.markdownTag(resource)
        });

        return await Note.save(newNote);
    };

    const nodeFetch = require('cross-fetch');

    shim.readLocalFileBase64 = path => {
        const data = fs.readFileSync(path);
        return new Buffer(data).toString('base64');
    };

    shim.fetch = async function (url, options = null) {
        if (!options) options = {};
        if (!options.timeout) options.timeout = 1000 * 120; // ms
        if (!('maxRetry' in options)) options.maxRetry = 5;

        let retryCount = 0;
        while (true) {
            try {
                const response = await nodeFetch(url, options);
                return response;
            } catch (error) {
                if (fetchRequestCanBeRetried(error)) {
                    retryCount++;
                    if (retryCount > options.maxRetry) throw error;
                    await time.sleep(retryCount * 3);
                } else {
                    throw error;
                }
            }
        }
    };

    shim.fetchBlob = async function (url, option) {
        error_msg = 'node shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };
}

module.exports = { shimInit };
