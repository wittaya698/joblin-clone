import { connect } from 'react-redux';
import { actions } from '@/src/root.js';
import { ItemListComponent } from '@/src/components/item-list.js';

class NoteListComponent extends ItemListComponent {
    listView_itemPress(noteId) {
        this.props.dispatch(actions.navigate({ noteId: noteId }));
        navigator.navigate('Note');
    }
}

const NoteList = connect(state => {
    return { items: state.nav.notes };
})(NoteListComponent);

export { NoteList };
