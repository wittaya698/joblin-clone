import { connect } from 'react-redux';
import { actions } from '@/src/root';

import { ItemListComponent } from '@/src/components/item-list';
import { Folder } from '@/src/models/folder';
import { Note } from '@/src/models/note';
import { Log } from '@/src/log';
import { NoteFolderService } from '@/src/services/note-folder-service.js';

class FolderListComponent extends ItemListComponent {
    listView_itemPress(folderId) {
        NoteFolderService.openNoteList(folderId);
    }
}

const FolderList = connect(state => {
    return {
        items: state.nav.folders,
        navigator: state.nav.navigator
    };
})(FolderListComponent);

export { FolderList };
