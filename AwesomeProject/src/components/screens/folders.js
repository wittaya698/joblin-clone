import React from 'react';
import { Button, View } from 'react-native';
import { connect } from 'react-redux';

import { FolderList } from '@/src/components/folder-list';
import { actions } from '@/src/root';

class FoldersScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { title: 'Folders' };
        // const nav = options.navigation;
        // Log.info('ici', nav);
        // //return { title: "Folders: " + nav.state.params.listMode };
        // return { title: <Text>Folders: {nav.state.params.listMode}</Text> };
    };

    createFolderButton_press = () => {
        this.props.dispatch(actions.navigate({ folderId: null }));
        this.props.navigation.navigate('Folder');
    };

    render() {
        this.props.dispatch(
            actions.set_navigator({ navigator: this.props.navigation })
        );
        return (
            <View style={{ flex: 1 }}>
                <FolderList style={{ flex: 1 }} />
                <Button
                    title="Create folder"
                    onPress={this.createFolderButton_press}
                />
            </View>
        );
    }
}

const FoldersScreen = connect(
    state => {
        return {
            folders: state.nav.folders
        };
    },
    dispatch => {
        return { dispatch: fn => dispatch(fn) };
    }
)(FoldersScreenComponent);

export { FoldersScreen };
