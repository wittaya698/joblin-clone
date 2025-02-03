import fs from 'fs-extra';
import { shim } from '@/lib/shim.js';
import { GeolocationNode } from '@/lib/geolocation-node.js';
import { FileApiDriverLocal } from '@/lib/file-api-driver-local.js';

function shimInit() {
    shim.fs = fs;
    shim.FileApiDriverLocal = FileApiDriverLocal;
    shim.Geolocation = GeolocationNode;
    shim.FormData = require('form-data');

    const nodeFetch = require('cross-fetch');

    shim.fetch = function (url, options = null) {
        if (!options) options = {};
        if (!options.timeout) options.timeout = 1000 * 120; // ms
        return nodeFetch(url, options);
    };

    shim.fetchBlob = async function (url, option) {
        error_msg = 'node shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };
}

export { shimInit };
