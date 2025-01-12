import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { _ } from '@/lib/locale.js';
import { Setting } from '@/lib/models/setting.js';
import { FileApi } from '@/lib/file-api.js';
import { FileApiDriverOneDrive } from '@/lib/file-api-driver-onedrive.js';
import { reg } from '@/lib/registry.js';
import { actions } from '@/root.js';

import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger
} from 'react-native-popup-menu';

const styles = StyleSheet.create({
    divider: {
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    }
});

class ScreenHeaderComponent extends Component {
    showBackButton() {
        // Note: this is hardcoded for now because navigation.state doesn't tell whether
        // it's possible to go back or not. Maybe it's possible to get this information
        // from somewhere else.
        navigator = this.props.navigator;
        return this.props.navState.routeName != 'Notes';
    }

    sideMenuButton_press() {
        this.props.dispatch(actions.side_menu_toggle());
    }

    backButton_press() {
        this.props.navigator.goBack();
    }

    menu_select(value) {
        if (typeof value == 'function') {
            value();
        }
    }

    async menu_synchronize() {
        if (reg.oneDriveApi().auth()) {
            let errMessage =
                "OneDrive API haven'n been able to be synced yet: Tenant does not have a SPO license";
            console.error(errMessage);
            throw new Error(errMessage);
        } else {
            navigator.navigate('OneDriveLogin');
        }
    }

    render() {
        let key = 0;
        let menuOptionComponents = [];
        for (let i = 0; i < this.props.menuOptions.length; i++) {
            let o = this.props.menuOptions[i];
            menuOptionComponents.push(
                <MenuOption value={o.onPress} key={'menuOption_' + key++}>
                    <Text>{o.title}</Text>
                </MenuOption>
            );
        }

        if (menuOptionComponents.length) {
            menuOptionComponents.push(
                <View key={'menuDivider_' + key++} style={styles.divider} />
            );
        }

        menuOptionComponents.push(
            <MenuOption
                value={() => this.menu_synchronize()}
                key={'menuOption_' + key++}
            >
                <Text>{_('Synchronize')}</Text>
            </MenuOption>
        );

        menuOptionComponents.push(
            <MenuOption value={1} key={'menuOption_' + key++}>
                <Text>{_('Configuration')}</Text>
            </MenuOption>
        );

        let title =
            'title' in this.props && this.props.title !== null
                ? this.props.title
                : _(this.props.navState.routeName);
        return (
            <View
                style={{
                    flexDirection: 'row',
                    padding: 10,
                    backgroundColor: '#ffffff',
                    alignItems: 'center'
                }}
            >
                <Button title="☰" onPress={() => this.sideMenuButton_press()} />
                <Button
                    disabled={!this.showBackButton()}
                    title="<"
                    onPress={() => this.backButton_press()}
                ></Button>
                <Text style={{ flex: 1, marginLeft: 10 }}>{title}</Text>
                <Menu onSelect={value => this.menu_select(value)}>
                    <MenuTrigger>
                        <Text style={{ fontSize: 20 }}>&#8942;</Text>
                    </MenuTrigger>
                    <MenuOptions>{menuOptionComponents}</MenuOptions>
                </Menu>
            </View>
        );
    }
}

ScreenHeaderComponent.defaultProps = {
    menuOptions: []
};

const ScreenHeader = connect(state => {
    return { user: state.nav.user, navigator: state.nav.navigator };
})(ScreenHeaderComponent);

export { ScreenHeader };
