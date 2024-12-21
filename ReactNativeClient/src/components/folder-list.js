import { connect } from 'react-redux';

import { ItemListComponent } from '@/src/components/item-list.js';
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
