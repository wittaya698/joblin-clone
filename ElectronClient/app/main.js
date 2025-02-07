// This is the basic initialization for the Electron MAIN process

// Make it possible to require("/lib/...") without specifying full path
require('app-module-path').addPath(__dirname);
require('@electron/remote/main').initialize();
require('source-map-support').install();

const electronApp = require('electron').app;
const { ElectronAppWrapper } = require('./ElectronAppWrapper');
const { initBridge } = require('./bridge');

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled promise rejection', p, 'reason:', reason);
    process.exit(1);
});

const wrapper = new ElectronAppWrapper(electronApp);

initBridge(wrapper);

wrapper.start().catch(error => {
    console.error('Electron App fatal error:');
    console.error(error);
});
