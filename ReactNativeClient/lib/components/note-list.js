import { connect } from 'react-redux';
import { actions } from '@/root.js';
import { ItemListComponent } from '@/lib/components/item-list.js';

class NoteListComponent extends ItemListComponent {
    listView_itemPress(noteId) {
        this.props.dispatch(
            actions.navigate({ routeName: 'Note', noteId: noteId })
        );
    }
}

const NoteList = connect(state => {
    return { items: state.nav.notes };
})(NoteListComponent);

export { NoteList };
