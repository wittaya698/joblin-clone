import { connect } from 'react-redux';
import { actions } from '@/src/root';

import { ItemListComponent } from '@/src/components/item-list';
import { Note } from '../models/note';

class FolderListComponent extends ItemListComponent {
    listView_itemPress = folderId => {
        const props = this.props;
        Note.previews(folderId).then(notes => {
            props.dispatch(actions.notes_update_all({ notes: notes }));
            props.dispatch(actions.navigate({ folderId: folderId }));
            props.navigator.navigate('Notes');
        });
    };
}

const FolderList = connect(
    state => {
        return {
            items: state.nav.folders,
            listMode: state.nav.listMode,
            navigator: state.nav.navigator
        };
    },
    dispatch => {
        return { dispatch: fn => dispatch(fn) };
    }
)(FolderListComponent);

export { FolderList };
