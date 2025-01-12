import { Note } from '@/lib/models/note.js';
import { actions } from '@/root.js';

class NotesScreenUtils {
    static openNoteList(folderId) {
        return Note.previews(folderId)
            .then(notes => {
                this.dispatch(actions.notes_update_all({ notes: notes }));
                this.dispatch(actions.navigate({ folderId: folderId }));
                navigator.navigate('Notes');
            })
            .catch(error => {
                Log.warn('Cannot load notes from ' + folderId, error);
            });
    }
}
export { NotesScreenUtils };
