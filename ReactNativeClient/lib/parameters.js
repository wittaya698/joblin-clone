const { Setting } = require('lib/models/setting.js');

const parameters_ = {};

parameters_.dev = {
    oneDrive: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    },
    oneDriveDemo: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    }
};

parameters_.prod = {
    oneDrive: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    },
    oneDriveDemo: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    }
};

function parameters(env = null) {
    if (env === null) env = Setting.value('env');
    let output = parameters_[env];
    if (Setting.value('isDemo')) {
        output.oneDrive = output.oneDriveDemo;
    }
    return output;
}

module.exports = { parameters };
