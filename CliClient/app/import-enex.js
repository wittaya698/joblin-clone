import appModulePath from 'app-module-path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

appModulePath.addPath(__dirname);

import { uuid } from '@/src/uuid.js';
import moment from 'moment';

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

function xmlNodeText(xmlNode) {
    if (!xmlNode || !xmlNode.length) return '';
    return xmlNode[0];
}

function dateToTimestamp(s) {
    let m = moment(s, 'YYYYMMDDTHHmmssZ');
    if (!m.isValid()) {
        throw new Error('Invalid date: ' + s);
    }
}

function xmlToMd(xml) {
    return parseXml(xml).then(xml => {});
}

let contentTest = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">
<en-note style="word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;">
	Hello, World.
	<div>
		<br/>
	</div>
	<div>
		<en-media alt="" type="image/jpeg" hash="dd7b6d285d09ec054e8cd6a3814ce093"/>
	</div>
	<div>
		<br/>
	</div>
</en-note>
`;

xmlToMd(contentTest).then(md => {
    console.info(md);
});

function toApiNote(xml) {
    let o = {};

    //console.info(xml);

    o.id = uuid.create();
    o.title = xmlNodeText(xml.title);

    // o.body = '';
    // if (xml.content && xml.content.length) {
    // 	o.body = xmlToMd(xml.content[0]);
    // }

    o.created_time = dateToTimestamp(xml.created);
    o.updated_time = dateToTimestamp(xml.updated);

    if (xml['note-attributes'] && xml['note-attributes'].length) {
        let attributes = xml['note-attributes'][0];
        o.latitude = xmlNodeText(attributes.latitude);
        o.longitude = xmlNodeText(attributes.longitude);
        o.altitude = xmlNodeText(attributes.altitude);
        o.author = xmlNodeText(attributes.author);
    }

    o.tags = [];
    if (xml.tag && xml.tag.length) o.tags = xml.tag;

    //console.info(o);

    return o;
}

// `id` binary(16) NOT NULL,
// `completed` tinyint(1) NOT NULL default '0',
// `created_time` int(11) NOT NULL default '0',
// `updated_time` int(11) NOT NULL default '0',
// `latitude` DECIMAL(10, 8) NOT NULL default '0',
// `longitude` DECIMAL(11, 8) NOT NULL default '0',
// `altitude` DECIMAL(9, 4) NOT NULL default '0',
// `parent_id` binary(16) NULL default NULL,
// `owner_id` binary(16),
// `is_encrypted` tinyint(1) NOT NULL default '0',
// `encryption_method` int(11) NOT NULL default '0',
// `order` int(11) NOT NULL default '0',
// `is_todo` tinyint(1) NOT NULL default '0',
// `todo_due` int(11) NOT NULL default '0',
// `todo_completed` int(11) NOT NULL default '0',
// `application_data` varchar(1024) NOT NULL DEFAULT "",
// `author` varchar(512) NOT NULL DEFAULT "",
// `source` varchar(512) NOT NULL DEFAULT "",
// `source_application` varchar(512) NOT NULL DEFAULT "",
// `source_url` varchar(1024) NOT NULL DEFAULT "",

// readFile('/Users/macbookair/Workspace/sample-enex.xml', 'utf8')
//     .then(content => {
//         return parseXml(content);
//     })
//     .then(doc => {
//         let notes = doc['en-export']['note'];
//         for (let i = 0; i < notes.length; i++) {
//             let note = notes[i];
//             console.info(note);
//         }
//     })
//     .catch(error => {
//         console.error('Error reading XML file', error);
//     });
