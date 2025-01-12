import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { actions } from '@/root.js';

class LoadingScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

    render() {
        this.props.dispatch(
            actions.set_navigator({ navigator: this.props.navigation })
        );
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
