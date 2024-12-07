import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { Log } from '@/src/log.js';

import {
    Dimensions,
    StyleSheet,
    ScrollView,
    View,
    Image,
    Text
} from 'react-native';
import { actions } from '../root';

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    menu: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20
    },
    name: {
        position: 'absolute',
        left: 70,
        top: 20
    },
    item: {
        fontSize: 14,
        fontWeight: '300',
        paddingTop: 5
    },
    button: {
        flex: 1,
        textAlign: 'left'
    }
});

class SideMenuContentComponent extends Component {
    constructor(props) {
        super(props);
    }

    folder_press(folder) {
        this.props.dispatch(actions.navigate({ folderId: folder.id }));
        navigator.navigate('Notes');
    }

    render() {
        let buttons = [];
        for (let i = 0; i < this.props.folders.length; i++) {
            let f = this.props.folders[i];
            buttons.push(
                <Button
                    style={styles.button}
                    title={f.title}
                    onPress={() => {
                        this.folder_press(f);
                    }}
                    key={f.id}
                />
            );
        }

        return (
            <ScrollView scrollsToTop={false} style={styles.menu}>
                {buttons}
            </ScrollView>
        );
    }
}

const SideMenuContent = connect(state => {
    return {
        folders: state.nav.folders
    };
})(SideMenuContentComponent);

export { SideMenuContent };
