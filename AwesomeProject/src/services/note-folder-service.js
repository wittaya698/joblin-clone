// A service that handle notes and folders in a uniform way

import { BaseService } from '@/src/base-service.js';
import { BaseModel } from '@/src/base-model.js';
import { Note } from '@/src/models/note.js';
import { Folder } from '@/src/models/folder.js';
import { Log } from '@/src/log.js';
import { Registry } from '@/src/registry.js';
import { actions } from '@/src/root';
import { connect } from 'react-redux';

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
                Registry.synchronizer().start();
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
