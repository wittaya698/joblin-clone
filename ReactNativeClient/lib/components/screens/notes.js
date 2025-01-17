import React from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import { NoteList } from '@/lib/components/note-list.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { Folder } from '@/lib/models/folder.js';
import { actions } from '@/root.js';
import { _ } from '@/lib/locale.js';
import { ActionButton } from '@/lib/components/action-button.js';
import { dialogs } from '@/lib/dialogs.js';
import { NotesScreenUtils } from '@/lib/components/screens/notes-utils.js';
import DialogBox from 'react-native-dialogbox';

class NotesScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

    deleteFolder_onPress(folderId) {
        dialogs.confirm(this, _('Delete notebook?')).then(ok => {
            if (!ok) return;

            Folder.delete(folderId)
                .then(() => {
                    return NotesScreenUtils.openDefaultNoteList();
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }

    editFolder_onPress(folderId) {
        this.props.dispatch(
            actions.navigate({ routeName: 'Folder', folderId: folderId })
        );
    }

    menuOptions() {
        return [
            {
                title: _('Delete folder'),
                onPress: () => {
                    this.deleteFolder_onPress(this.props.selectedFolderId);
                }
            },
            {
                title: _('Edit folder'),
                onPress: () => {
                    this.editFolder_onPress(this.props.selectedFolderId);
                }
            }
        ];
    }

    render() {
        let folder = Folder.byId(
            this.props.folders,
            this.props.selectedFolderId
        );
        let title = folder ? folder.title : null;

        nav = this.props.navigation;
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader
                    title={title}
                    navState={{ routeName: routeName }}
                    menuOptions={this.menuOptions()}
                />
                <NoteList
                    noItemMessage={_(
                        'There are currently no notes. Create one by clicking on the (+) button.'
                    )}
                    style={{ flex: 1 }}
                />
                <ActionButton
                    parentFolderId={this.props.selectedFolderId}
                ></ActionButton>

                <DialogBox
                    ref={dialogbox => {
                        this.dialogbox = dialogbox;
                    }}
                />
            </View>
        );
    }
}

const NotesScreen = connect(state => {
    return {
        folders: state.nav.folders,
        selectedFolderId: state.nav.selectedFolderId
    };
})(NotesScreenComponent);

export { NotesScreen };
