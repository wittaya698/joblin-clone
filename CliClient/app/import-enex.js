import appModulePath from 'app-module-path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

appModulePath.addPath(__dirname);

import Promise from 'promise';
import fs from 'fs';
import xml2js from 'xml2js';

function parseXml(xml) {
    return new Promise((resolve, reject) => {
        xml2js.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function readFile(path, options = null) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

readFile('/Users/macbookair/Workspace/sample-enex.xml', 'utf8')
    .then(content => {
        return parseXml(content);
    })
    .then(doc => {
        let notes = doc['en-export']['note'];
        for (let i = 0; i < notes.length; i++) {
            let note = notes[i];
            console.info(note);
        }
    })
    .catch(error => {
        console.error('Error reading XML file', error);
    });
