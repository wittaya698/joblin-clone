import { shim } from '@/lib/shim.js';
import { GeolocationReact } from '@/lib/geolocation-react.js';
import RNFS from 'react-native-fs';

function shimInit() {
    shim.Geolocation = GeolocationReact;

    shim.fetchBlob = async function (url, option) {
        error_msg = 'react shim.fetchBlob has been called';
        console.error(error_msg);
        throw new Error(error_msg);
    };
}

export { shimInit };
