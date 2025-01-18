import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { ActionButton } from '@/lib/components/action-button.js';
import { _ } from '@/lib/locale.js';
import { actions } from '@/root.js';

class WelcomeScreenComponent extends React.Component {
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
            let message = this.props.folders.length
                ? _(
                      'Click on the (+) button to create a new note or notebook. Click on the side menu to access your existing notebooks.'
                  )
                : _(
                      'You currently have no notebook. Create one by clicking on (+) button.'
                  );
            return (
                <View style={{ flex: 1 }}>
                    <ScreenHeader navState={{ routeName: routeName }} />
                    <Text>{message}</Text>
                    <ActionButton addFolderNoteButtons={true}></ActionButton>
                </View>
            );
        }
    }
}

const WelcomeScreen = connect(state => {
    return {
        loading: state.nav.loading,
        folders: state.nav.folders
    };
})(WelcomeScreenComponent);

export { WelcomeScreen };
