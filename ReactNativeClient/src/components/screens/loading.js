import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { NoteFolderService } from '@/lib/services/note-folder-service.js';
import { actions } from '@/lib/root.js';

class LoadingScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

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
