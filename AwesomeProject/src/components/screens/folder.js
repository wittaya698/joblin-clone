import React from 'react';
import { Folder } from '../../models/folder';
import { connect } from 'react-redux';
import { Button, TextInput, View } from 'react-native';

class FolderScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Folder'
    };

    constructor() {
        super();
        this.state = { folder: Folder.newFolder() };
    }

    componentWillMount() {
        this.setState({ folder: this.props.folder });
    }

    folderComponent_change = (propName, propValue) => {
        this.setState((prevState, props) => {
            let folder = Object.assign({}, prevState.folder);
            folder[propName] = propValue;
            return { folder: folder };
        });
    };

    title_changeText = text => {
        this.folderComponent_change('title', text);
    };

    saveFolderButton_press = () => {
        Folder.save(this.state.folder)
            .then(folder => {
                this.props.folder_update_one({ folder: folder });
            })
            .catch(error => {
                Log.warn('Cannot save folder', error);
            });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    value={this.state.folder.title}
                    onChangeText={this.title_changeText}
                />
                <Button
                    title="Save folder"
                    onPress={this.saveFolderButton_press}
                />
            </View>
        );
    }
}

const FolderScreen = connect(state => {
    return {
        folder: state.selectedFolderId
            ? Folder.byId(state.folders, state.selectedFolderId)
            : Folder.newFolder()
    };
})(FolderScreenComponent);

export { FolderScreen };
