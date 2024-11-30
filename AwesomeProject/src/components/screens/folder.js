import React from 'react';
import { Folder } from '@/src/models/folder';
import { ScreenHeader } from '@/src/components/screen-header';
import { connect } from 'react-redux';
import { Button, TextInput, View } from 'react-native';

class FolderScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    constructor() {
        super();
        this.state = { folder: Folder.newFolder() };
    }

    UNSAFE_componentWillMount() {
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
                this.props.folders_update_one({ folder: folder });
            })
            .catch(error => {
                Log.warn('Cannot save folder', error);
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
    return {
        folder: state.nav.selectedFolderId
            ? Folder.byId(state.nav.folders, state.nav.selectedFolderId)
            : Folder.newFolder()
    };
})(FolderScreenComponent);

export { FolderScreen };
