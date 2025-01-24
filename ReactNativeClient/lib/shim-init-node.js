import fs from 'fs-extra';
import { shim } from '@/lib/shim.js';
import { GeolocationNode } from '@/lib/geolocation-node.js';
import { FileApiDriverLocal } from '@/lib/file-api-driver-local.js';

function shimInit() {
    shim.fs = fs;
    shim.FileApiDriverLocal = FileApiDriverLocal;
    shim.Geolocation = GeolocationNode;

    shim.fetch = require('cross-fetch');
    shim.FormData = require('form-data');

    shim.fetchBlob = async function (url, option) {
        error_msg = 'node shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };
}

export { shimInit };
