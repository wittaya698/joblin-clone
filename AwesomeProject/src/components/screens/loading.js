import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/src/log.js';
import { Folder } from '@/src/models/folder.js';
import { ScreenHeader } from '@/src/components/screen-header.js';
import { NoteFolderService } from '@/src/services/note-folder-service.js';
import { actions } from '@/src/root';

class LoadingScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    render() {
        const nav = this.props.navigation;
        NoteFolderService.navigator = nav;
        this.props.dispatch(actions.set_navigator({ navigator: nav }));
        return (
            <View style={{ flex: 1 }}>
                <Text>Loading...</Text>
            </View>
        );
    }
}

const LoadingScreen = connect(state => {
    return {};
})(LoadingScreenComponent);

export { LoadingScreen };
