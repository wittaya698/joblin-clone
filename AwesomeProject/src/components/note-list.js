import { ItemListComponent } from '@/src/components/item-list';
import { connect } from 'react-redux';
import { actions } from '../root';

class NoteListComponent extends ItemListComponent {
    constructor(props) {
        super(props);
    }
}

const NoteList = connect(
    state => {
        return {
            items: state.nav.notes
        };
    },
    dispatch => {
        return {
            onItemClick: (navigation, noteId) => {
                dispatch(
                    actions.navigate({
                        navigation: navigation,
                        route: 'Note',
                        noteId: noteId
                    })
                );
            }
        };
    }
)(NoteListComponent);

export { NoteList };
