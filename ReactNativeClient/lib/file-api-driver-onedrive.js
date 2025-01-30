import moment from 'moment';
import { OneDriveApi } from '@/lib/onedrive-api.js';

class FileApiDriverOneDrive {
    constructor(api) {
        this.api_ = api;
        this.pathCache_ = {};
    }

    api() {
        return this.api_;
    }

    supportsDelta() {
        return true;
    }
}
export { FileApiDriverOneDrive };
