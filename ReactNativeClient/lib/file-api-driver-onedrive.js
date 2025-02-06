const moment = require('moment');
const { OneDriveApi } = require('@/lib/onedrive-api.js');

class FileApiDriverOneDrive {
    constructor(api) {
        this.api_ = api;
        this.pathCache_ = {};
    }

    api() {
        return this.api_;
    }

    itemFilter_() {
        return {
            select: 'name,file,folder,fileSystemInfo,parentReference'
        };
    }

    makePath_(path) {
        return path;
    }

    makeItems_(odItems) {
        throw new Error(
            'FileApiDriverOneDrive makeItems_() need to be implemented'
        );
    }

    makeItem_(odItem) {
        throw new Error(
            'FileApiDriverOneDrive makeItem_() need to be implemented'
        );
    }

    async statRaw_(path) {
        throw new Error(
            'FileApiDriverOneDrive funstatRaw_ction() need to be implemented'
        );
    }

    async stat(path) {
        throw new Error('FileApiDriverOneDrive stat() need to be implemented');
    }

    async setTimestamp(path, timestamp) {
        throw new Error(
            'FileApiDriverOneDrive setTimestamp() need to be implemented'
        );
    }

    async list(path, options = null) {
        throw new Error('FileApiDriverOneDrive list() need to be implemented');
    }

    async get(path, options = null) {
        throw new Error('FileApiDriverOneDrive get() need to be implemented');
    }

    async mkdir(path) {
        throw new Error('FileApiDriverOneDrive mkdir() need to be implemented');
    }

    put(path, content, options = null) {
        throw new Error('FileApiDriverOneDrive put() need to be implemented');
    }

    delete(path) {
        throw new Error(
            'FileApiDriverOneDrive delete() need to be implemented'
        );
    }

    async move(oldPath, newPath) {
        throw new Error('FileApiDriverOneDrive move() need to be implemented');
    }

    format() {
        throw new Error(
            'FileApiDriverOneDrive format() need to be implemented'
        );
    }

    async pathDetails_(path) {
        throw new Error(
            'FileApiDriverOneDrive pathDetails_() need to be implemented'
        );
    }

    async delta(path, options = null) {
        throw new Error('FileApiDriverOneDrive delta() need to be implemented');
    }
}

export { FileApiDriverOneDrive };
