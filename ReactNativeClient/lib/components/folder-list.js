import { connect } from 'react-redux';

import { ItemListComponent } from '@/lib/components/item-list.js';
import { NotesScreenUtils } from '@/lib/components/screens/notes-utils.js';

class FolderListComponent extends ItemListComponent {
    listView_itemPress(folderId) {
        NotesScreenUtils.openNoteList(folderId);
    }
}

const FolderList = connect(state => {
    return {
        items: state.nav.folders,
        navigator: state.nav.navigator
    };
})(FolderListComponent);

export { FolderList };
