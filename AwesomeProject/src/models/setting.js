import { BaseModel } from '@/src/base-model';

class Setting extends BaseModel {
    static tableName() {
        console.error('tabaleName(): to be implemented');
        throw Error();
    }

    static defaultSetting(key) {
        console.error('defaultSetting(): to be implemented');
        throw Error();
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
        console.error('value(): to be implemented');
        throw Error();
    }

    static scheduleUpdate() {
        console.error('scheduleUpdate(): to be implemented');
        throw Error();
    }
}

export { Setting };
