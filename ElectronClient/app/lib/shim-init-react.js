const { shim } = require('lib/shim.js');
const { GeolocationReact } = require('lib/geolocation-react.js');
const { PoorManIntervals } = require('lib/poor-man-intervals.js');
const RNFS = require('react-native-fs');
require('react-native-get-random-values');

function shimInit() {
    shim.Geolocation = GeolocationReact;

    shim.setInterval = PoorManIntervals.setInterval;
    shim.clearInterval = PoorManIntervals.clearInterval;

    shim.fetch = async function (url, options = null) {
        return shim.fetchWithRetry(() => {
            return shim.nativeFetch_(url, options);
        }, options);

        // if (!options) options = {};
        // if (!options.timeout) options.timeout = 1000 * 120; // ms
        // if (!('maxRetry' in options)) options.maxRetry = 5;
        // let retryCount = 0;
        // while (true) {
        // 	try {
        // 		const response = await nodeFetch(url, options);
        // 		return response;
        // 	} catch (error) {
        // 		if (fetchRequestCanBeRetried(error)) {
        // 			retryCount++;
        // 			if (retryCount > options.maxRetry) throw error;
        // 			await time.sleep(retryCount * 3);
        // 		} else {
        // 			throw error;
        // 		}
        // 	}
        // }
    };

    shim.fetchBlob = async function (url, option) {
        throw new Error('react shim.fetchBlob need implementation');
    };

    shim.uploadBlob = async function (url, options) {
        throw new Error('react shim.uploadBlob need implementation');
    };

    shim.readLocalFileBase64 = async function (path) {
        return RNFS.readFile(path, 'base64');
    };
}

module.exports = { shimInit };
