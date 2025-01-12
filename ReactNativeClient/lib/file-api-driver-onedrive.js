import moment from 'moment';
import { OneDriveApi } from '@/lib/onedrive-api.js';

class FileApiDriverOneDrive {
    // constructor(clientId, clientSecret) {
    constructor(api) {
        this.api_ = api;
        // this.api_ = new OneDriveApi(clientId, clientSecret);
    }

    api() {
        return this.api_;
    }
}
export { FileApiDriverOneDrive };
