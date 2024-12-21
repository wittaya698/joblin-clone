// A service that handle notes and folders in a uniform way

import { BaseService } from '@/src/base-service.js';
import { BaseModel } from '@/src/base-model.js';
import { Note } from '@/src/models/note.js';
import { Folder } from '@/src/models/folder.js';
import { Log } from '@/src/log.js';
import { actions } from '@/src/root.js';

class NoteFolderService extends BaseService {
    static save(type, item, oldItem) {
        if (oldItem) {
            let diff = BaseModel.diffObjects(oldItem, item);
            if (!Object.getOwnPropertyNames(diff).length) {
                Log.info('Item not changed - not saved');
                return Promise.resolve(item);
            }
        }

        let ItemClass = null;
        if (type == 'note') {
            ItemClass = Note;
        } else if (type == 'folder') {
            ItemClass = Folder;
        }

        let isNew = !item.id;
        let output = null;
        return ItemClass.save(item)
            .then(item => {
                output = item;
                if (isNew && type == 'note')
                    return Note.updateGeolocation(item.id);
            })
            .then(() => {
                // Registry.synchronizer().start();
                return output;
            });
    }

    // static setField(type, itemId, fieldName, fieldValue, oldValue = undefined) {
    //     // TODO: not really consistent as the promise will return 'null' while
    //     // this.save will return the note or folder. Currently not used, and maybe not needed.
    //     if (oldValue !== undefined && fieldValue === oldValue)
    //         return Promise.resolve();

    //     let item = { id: itemId };
    //     item[fieldName] = fieldValue;
    //     let oldItem = { id: itemId };
    //     return this.save(type, item, oldItem);
    // }

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
