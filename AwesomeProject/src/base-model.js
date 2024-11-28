import { Log } from '@/src/log.js';
import { Database } from '@/src/database.js';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

class BaseModel {
    static tableName() {
        throw new Error('Must be overriden');
    }

    static save(o) {
        let isNew = !o.id;
        if (isNew) o.id = uuidv4();
        if (isNew) {
            let q = Database.insertSql(this.tableName(), o);
            return this.db()
                .insert(q.sql, q.params)
                .then(() => {
                    return o;
                });
        } else {
            Log.error('NOT EIMPLEMENTED');
            // TODO: update
        }
    }

    static setDb(database) {
        this.db_ = database;
    }

    static db() {
        return this.db_;
    }
}

export { BaseModel };
