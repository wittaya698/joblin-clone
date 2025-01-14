import { Setting } from '@/lib/models/setting.js';

const parameters_ = {};

parameters_.dev = {
    oneDrive: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    }
};

parameters_.prod = {
    oneDrive: {
        id: 'bf3ae325-ea99-4aaf-9eb8-1e24b897576d',
        secret: '20L8Q~jMvYokkbJoahqsYZigA~PMcqKIgAL5HcHJ'
    }
};

function parameters() {
    return parameters_[Setting.value('env')];
}

export { parameters };
