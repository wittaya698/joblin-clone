// A service that handle notes and folders in a uniform way

// TODO: remote this service
// - Move setting of geo-location to GUI side (only for note explicitely created on client
// - Don't do diffing - make caller explicitely set model properties that need to be saved

import { BaseService } from '@/src/base-service.js';
import { BaseModel } from '@/src/base-model.js';
import { BaseItem } from 'src/models/base-item.js';
import { Note } from '@/src/models/note.js';
import { Folder } from '@/src/models/folder.js';
import { Log } from '@/src/log.js';
import { time } from '@/src/time-utils.js';
// import { actions } from '@/src/root.js';

class NoteFolderService extends BaseService {
    static save(type, item, oldItem, options = null) {
        let diff = null;
        if (oldItem) {
            diff = BaseModel.diffObjects(oldItem, item);
            if (!Object.getOwnPropertyNames(diff).length) {
                Log.info('Item not changed - not saved');
                return Promise.resolve(item);
            }
        }

        let ItemClass = BaseItem.itemClass(item);

        let isNew = !item.id;
        let output = null;

        let toSave = item;
        if (diff !== null) {
            toSave = diff;
            toSave.id = item.id;
        }

        return ItemClass.save(toSave, options)
            .then(savedItem => {
                output = Object.assign(item, savedItem);
                if (isNew && type == 'note')
                    return Note.updateGeolocation(item.id);
            })
            .then(() => {
                // Registry.synchronizer().start();
                return output;
            });
    }

    static openNoteList(folderId) {
        return Note.previews(folderId)
            .then(
                function (notes) {
                    this.dispatch(actions.notes_update_all({ notes: notes }));
                    this.dispatch(actions.navigate({ folderId: folderId }));
                    this.navigator.navigate('Notes');
                }.bind(this)
            )
            .catch(error => {
                Log.warn('Cannot load notes', error);
            });
    }
}

export { NoteFolderService };
