import { connect } from 'react-redux';
import { actions } from '@/src/root';

import { ItemListComponent } from '@/src/components/item-list';
import { Note } from '../models/note';

class FolderListComponent extends ItemListComponent {
    constructor(props) {
        super();
        this.navigation = props.navigation;
    }

    listView_itemClick = folderId => {
        Note.previews(folderId).then(notes => {
            this.props.notesUpdateAll(notes);

            this.props.goToNotes(this.navigation, folderId);
        });
    };
}

const FolderList = connect(
    state => {
        return { items: state.nav.folders };
    },
    dispatch => {
        return {
            notesUpdateAll: notes => {
                dispatch(actions.notes_update_all({ notes: notes }));
            },
            goToNotes: (nv, folderId) => {
                dispatch(
                    actions.navigate({
                        navigation: nv,
                        route: 'Notes',
                        folderId: folderId
                    })
                );
            }
        };
    }
)(FolderListComponent);

export { FolderList };
