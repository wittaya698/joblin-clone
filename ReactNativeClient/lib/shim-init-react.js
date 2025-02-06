const { shim } = require('@/lib/shim.js');
const { GeolocationReact } = require('@/lib/geolocation-react.js');
const { PoorManIntervals } = require('@/lib/poor-man-intervals.js');
const RNFS = require('react-native-fs');
require('react-native-get-random-values');

function shimInit() {
    shim.Geolocation = GeolocationReact;

    shim.setInterval = PoorManIntervals.setInterval;
    shim.clearInterval = PoorManIntervals.clearInterval;

    shim.fetchBlob = async function (url, option) {
        error_msg = 'react shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };

    shim.uploadBlob = async function (url, options) {
        error_msg = 'react shim.uploadBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };

    shim.readLocalFileBase64 = async function (path) {
        return RNFS.readFile(path, 'base64');
    };
}

module.exports = { shimInit };
