import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { ActionButton } from '@/lib/components/action-button.js';
import { actions } from '@/root.js';

class LoadingScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

    render() {
        this.props.dispatch(
            actions.set_navigator({ navigator: this.props.navigation })
        );
        nav = this.props.navigation;
        routeName = nav.getState().routes[nav.getState().index].name;
        if (this.props.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <Text>Loading...</Text>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <ScreenHeader navState={{ routeName: routeName }} />
                    <Text>
                        You currently have no notebook. Create one by clicking
                        on (+) button.
                    </Text>
                    <ActionButton></ActionButton>
                </View>
            );
        }
    }
}

const LoadingScreen = connect(state => {
    return { loading: state.loading };
})(LoadingScreenComponent);

export { LoadingScreen };
