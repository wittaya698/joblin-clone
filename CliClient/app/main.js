#!/usr/bin/env node

// Loading time: 20170803: 1.5s with no commands
require('app-module-path').addPath(__dirname);

const { app } = require('./app.js');
const { BaseModel } = require('lib/base-model.js');
const { Folder } = require('lib/models/folder.js');
const { Resource } = require('lib/models/resource.js');
const { BaseItem } = require('lib/models/base-item.js');
const { Note } = require('lib/models/note.js');
const { Tag } = require('lib/models/tag.js');
const { NoteTag } = require('lib/models/note-tag.js');
const { Setting } = require('lib/models/setting.js');
const { Logger } = require('lib/logger.js');
const { FsDriverNode } = require('lib/fs-driver-node.js');
const { shimInit } = require('lib/shim-init-node.js');
const { _ } = require('lib/locale.js');

const fsDriver = new FsDriverNode();
Logger.fsDriver_ = fsDriver;
Resource.fsDriver_ = fsDriver;

// That's not good, but it's to avoid circular dependency issues
// in the BaseItem class.
BaseItem.loadClass('Note', Note);
BaseItem.loadClass('Folder', Folder);
BaseItem.loadClass('Resource', Resource);
BaseItem.loadClass('Tag', Tag);
BaseItem.loadClass('NoteTag', NoteTag);

Setting.setConstant('appId', 'net.witthaya.joplin_clone-cli');
Setting.setConstant('appType', 'cli');

shimInit();

const application = app();

if (process.platform === 'win32') {
    throw new Error("process.platform === 'win32' in main.js");
    var rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', function () {
        process.emit('SIGINT');
    });
}

application.start(process.argv).catch(error => {
    console.log(_('Fatal error:'));
    console.log(error);
});
