import moment from 'moment';
import { OneDriveApi } from '@/lib/onedrive-api.js';

class FileApiDriverOneDrive {
    constructor(api) {
        this.api_ = api;
    }

    api() {
        return this.api_;
    }

    supportsDelta() {
        return true;
    }
}
export { FileApiDriverOneDrive };
