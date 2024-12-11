import appModulePath from 'app-module-path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

appModulePath.addPath(__dirname);

import { WebApi } from './src/web-api.js';

// setTimeout(() => {
// 	console.info('ici');
// }, 1000);

let api = new WebApi('http://localhost:8000');
console.log('API: ', api);

api.post('sessions', null, {
    email: 'wittayathongjeen698@gmail.com',
    password: '0906198331',
    client_id: 'C1C1C1C1C1C1C1'
}).then(session => {
    console.info(session);
});
