import React from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/src/log.js';
import { NoteList } from '@/src/components/note-list';

class NotesScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Notes'
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <NoteList style={{ flex: 1 }} />
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        title="Create note"
                        onPress={this.createNoteButton_press}
                    />
                    <Button
                        title="Create folder"
                        onPress={this.createFolderButton_press}
                    />
                    <Button title="Login" onPress={this.loginButton_press} />
                    <Button title="Sync" onPress={this.syncButton_press} />
                </View>
            </View>
        );
    }
}

const NotesScreen = connect(state => {
    return {
        folders: state.folders
    };
})(NotesScreenComponent);

export { NotesScreen };
