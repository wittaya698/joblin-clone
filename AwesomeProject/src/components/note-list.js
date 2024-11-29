import { ItemListComponent } from '@/src/components/item-list';
import { connect } from 'react-redux';
import { actions } from '../root';

class NoteListComponent extends ItemListComponent {
    constructor(props) {
        super();
        this.navigation = props.navigation;
    }

    listView_itemClick = noteId => {
        this.props.goToNote(this.navigation, noteId);
    };
}

const NoteList = connect(
    state => {
        return {
            items: state.nav.notes
        };
    },
    dispatch => {
        return {
            goToNote: (nv, noteId) => {
                dispatch(
                    actions.navigate({
                        navigation: nv,
                        route: 'Note',
                        noteId: noteId
                    })
                );
            }
        };
    }
)(NoteListComponent);

export { NoteList };
