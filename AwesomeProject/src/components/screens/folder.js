import React from 'react';
import { connect } from 'react-redux';
import { Button, TextInput, View } from 'react-native';

import { Folder } from '@/src/models/folder';
import { ScreenHeader } from '@/src/components/screen-header';
import { NoteFolderService } from '@/src/services/note-folder-service.js';

class FolderScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    constructor() {
        super();
        this.state = { folder: Folder.new() };
        this.originalFolder = null;
    }

    UNSAFE_componentWillMount() {
        if (!this.props.folderId) {
            this.setState({ folder: Folder.new() });
        } else {
            Folder.load(this.props.folderId).then(folder => {
                this.originalFolder = Object.assign({}, folder);
                this.setState({ folder: folder });
            });
        }
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
        NoteFolderService.save(
            'folder',
            this.state.folder,
            this.originalFolder
        ).then(folder => {
            this.originalFolder = Object.assign({}, folder);
            this.setState({ folder: folder });
        });
    };

    render() {
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
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
    return { folderId: state.nav.selectedFolderId };
})(FolderScreenComponent);

export { FolderScreen };
