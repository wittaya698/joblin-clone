import { BaseModel } from '@/src/base-model';

class Setting extends BaseModel {
    static tableName() {
        return 'settings';
    }

    static defaultSetting(key) {
        if (!this.defaults_) {
            this.defaults_ = {
                clientId: { value: '', type: 'string' },
                sessionId: { value: '', type: 'string' },
                lastUpdateTime: { value: '', type: 'int' }
            };
        }
        if (!(key in this.defaults_)) throw new Error('Unknown key: ' + key);

        let output = Object.assign({}, this.defaults_[key]);
        output.key = key;
        return output;
    }

    static load() {
        this.cache_ = [];
        return this.db()
            .selectAll('SELECT * FROM settings')
            .then(r => {
                for (let i = 0; i < r.rows.length; i++) {
                    this.cache_.push(r.rows.item(i));
                }
            });
    }

    static setValue(key, value) {
        console.error('setValue(): to be implemented');
        throw Error();
    }

    static value(key) {
        for (let i = 0; i < this.cache_.length; i++) {
            if (this.cache_[i].key == key) {
                return this.cache_[i].value;
            }
        }

        let s = this.defaultSetting(key);
        return s.value;
    }

    static scheduleUpdate() {
        console.error('scheduleUpdate(): to be implemented');
        throw Error();
    }
}

export { Setting };
