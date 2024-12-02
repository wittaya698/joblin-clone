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
    static navigationOptions = options => {
        return { header: null };
    };

    createNoteButton_press = () => {
        this.props.navigation.navigate('Note');
    };

    createFolderButton_press = () => {
        this.props.navigation.navigate('Folder');
    };

    loginButton_press = () => {
        this.props.navigation.navigate('Login');
    };

    syncButton_press = () => {
        Log.info('SYNC');
    };

    deleteFolder_onPress = folderId => {
        Folder.delete(folderId).then(() => {
            this.props.dispatch(actions.folder_delete({ folderId: folderId }));
            this.props.navigator.navigate('Folders');
        });
    };

    editFolder_onPress = folderId => {
        this.props.dispatch(actions.navigate({ folderId: folderId }));
        this.props.navigator.navigate('Folder');
    };

    menuOptions = () => {
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
    };

    render() {
        let folder = Folder.byId(
            this.props.folders,
            this.props.selectedFolderId
        );
        let title = folder ? folder.title : null;

        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader
                    title={title}
                    navState={{ routeName: routeName }}
                    menuOptions={this.menuOptions()}
                />
                <NoteList style={{ flex: 1 }} />
                <View style={{ flexDirection: 'row' }}>
                    <Button title="Login" onPress={this.loginButton_press} />
                    <Button title="Sync" onPress={this.syncButton_press} />
                </View>
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
        selectedFolderId: state.nav.selectedFolderId,
        navigator: state.nav.navigator
    };
})(NotesScreenComponent);

export { NotesScreen };
