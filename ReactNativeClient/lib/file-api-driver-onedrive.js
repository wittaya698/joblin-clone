import moment from 'moment';
import { OneDriveApi } from '@/lib/onedrive-api.js';

class FileApiDriverOneDrive {
    syncTargetId() {
        return 3;
    }

    syncTargetName() {
        return 'onedrive';
    }

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
