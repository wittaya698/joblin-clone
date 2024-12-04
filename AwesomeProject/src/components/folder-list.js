import { connect } from 'react-redux';
import { actions } from '@/src/root';

import { ItemListComponent } from '@/src/components/item-list';
import { Folder } from '@/src/models/folder';
import { Note } from '@/src/models/note';
import { Log } from '@/src/log';

class FolderListComponent extends ItemListComponent {
    listView_itemPress = folderId => {
        Folder.load(folderId).then(folder => {
            Log.info('Current folder', folder);

            const props = this.props;
            Note.previews(folderId)
                .then(notes => {
                    props.dispatch(actions.notes_update_all({ notes: notes }));
                    props.dispatch(actions.navigate({ folderId: folderId }));
                    props.navigator.navigate('Notes');
                })
                .catch(error => {
                    Log.warn('Cannot load notes', error);
                });
        });
    };
}

const FolderList = connect(state => {
    return {
        items: state.nav.folders,
        listMode: state.nav.listMode,
        navigator: state.nav.navigator
    };
})(FolderListComponent);

export { FolderList };
