import { BaseService } from '@/lib/base-service.js';
import { BaseModel } from '@/lib/base-model.js';
import { BaseItem } from 'lib/models/base-item.js';
import { Note } from '@/lib/models/note.js';
import { Folder } from '@/lib/models/folder.js';
import { Log } from '@/lib/log.js';
import { time } from '@/lib/time-utils.js';
// import { actions } from '@/lib/root.js';

class NoteFolderService {
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
