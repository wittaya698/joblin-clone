import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-native';
import { NoteFolderService } from '@/lib/services/note-folder-service.js';

import { StyleSheet, ScrollView } from 'react-native';

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
        navigator.navigate('Notes');
        NoteFolderService.openNoteList(folder.id);
    }

    render() {
        let buttons = [];
        for (let i = 0; i < this.props.folders.length; i++) {
            let f = this.props.folders[i];
            let title = f.title + (f.is_default ? ' *' : '');
            buttons.push(
                <Button
                    style={styles.button}
                    title={title}
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
