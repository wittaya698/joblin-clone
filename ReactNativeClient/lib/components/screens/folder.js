import React from 'react';
import { connect } from 'react-redux';
import { Button, TextInput, View } from 'react-native';

import { Folder } from '@/lib/models/folder.js';
import { BaseModel } from '@/lib/base-model.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { NotesScreenUtils } from '@/lib/components/screens/notes-utils.js';
import { actions } from '@/root.js';

class FolderScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

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

    folderComponent_change(propName, propValue) {
        this.setState((prevState, props) => {
            let folder = Object.assign({}, prevState.folder);
            folder[propName] = propValue;
            return { folder: folder };
        });
    }

    title_changeText(text) {
        this.folderComponent_change('title', text);
    }

    async saveFolderButton_press() {
        let toSave = {
            title: this.state.folder.title
        };

        if (this.originalFolder) toSave.id = this.originalFolder.id;

        this.originalFolder = await Folder.save(toSave);
        this.setState({ folder: this.originalFolder });

        await NotesScreenUtils.openDefaultNoteList();
    }

    render() {
        nav = this.props.navigation;
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
                <TextInput
                    value={this.state.folder.title}
                    onChangeText={text => this.title_changeText(text)}
                />
                <Button
                    title="Save folder"
                    onPress={() => this.saveFolderButton_press()}
                />
            </View>
        );
    }
}

const FolderScreen = connect(state => {
    return { folderId: state.nav.selectedFolderId };
})(FolderScreenComponent);

export { FolderScreen };
