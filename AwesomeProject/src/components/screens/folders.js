import React from 'react';
import { Button, View } from 'react-native';
import { connect } from 'react-redux';

import { FolderList } from '@/src/components/folder-list';

class FoldersScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Folders'
    };

    createFolderButton_press = () => {
        this.props.navigation.navigate('Folder');
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FolderList
                    style={{ flex: 1 }}
                    navigation={this.props.navigation}
                />
                <Button
                    title="Create folder"
                    onPress={this.createFolderButton_press}
                />
            </View>
        );
    }
}

const FoldersScreen = connect(state => {
    return {
        folders: state.nav.folders
    };
})(FoldersScreenComponent);

export { FoldersScreen };
