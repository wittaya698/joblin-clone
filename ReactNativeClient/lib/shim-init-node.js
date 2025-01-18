import fs from 'fs-extra';
import { shim } from '@/lib/shim.js';
import { GeolocationNode } from '@/lib/geolocation-node.js';

function shimInit() {
    shim.Geolocation = GeolocationNode;

    shim.fetchBlob = async function (url, option) {
        error_msg = 'node shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };
}

export { shimInit };
