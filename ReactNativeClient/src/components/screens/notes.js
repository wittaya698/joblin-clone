import React from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/src/log.js';
import { NoteList } from '@/src/components/note-list';
import { ScreenHeader } from '@/src/components/screen-header';
import { Folder } from '@/src/models/folder';
import { actions } from '@/src/root';
import { _ } from '@/src/locale';
import { ActionButton } from '../action-button';

class NotesScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

    deleteFolder_onPress(folderId) {
        Folder.delete(folderId)
            .then(() => {
                navigator.navigate('Folders');
            })
            .catch(error => {
                alert(error.message);
            });
    }

    editFolder_onPress(folderId) {
        this.props.dispatch(actions.navigate({ folderId: folderId }));
        navigator.navigate('Folder');
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
                <NoteList style={{ flex: 1 }} />
                <ActionButton
                    parentFolderId={this.props.selectedFolderId}
                ></ActionButton>
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
