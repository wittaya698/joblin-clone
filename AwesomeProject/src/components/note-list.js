import { ItemListComponent } from '@/src/components/item-list';
import { connect } from 'react-redux';
import { actions } from '../root';

class NoteListComponent extends ItemListComponent {
    listView_itemPress = noteId => {
        this.dispatch(actions.navigate({ noteId: noteId }));
        this.props.navigator.navigate('Note');
    };
}

const NoteList = connect(
    state => {
        return { items: state.nav.notes, navigator: state.nav.navigator };
    },
    dispatch => {
        return { dispatch: fn => dispatch(fn) };
    }
)(NoteListComponent);

export { NoteList };
