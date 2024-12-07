import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Log } from '@/src/log.js';
import { _ } from '@/src/locale.js';
import { Setting } from '@/src/models/setting';

import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger
} from 'react-native-popup-menu';
import { actions } from '@/src/root';

const styles = StyleSheet.create({
    divider: {
        marginVertical: 5,
        marginHorizontal: 2,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    }
});

class ScreenHeaderComponent extends Component {
    static defaultProps = {
        menuOptions: []
    };

    menu_login = () => {
        this.props.navigator.navigate('Login');
    };

    menu_logout = () => {
        let user = { email: null, session: null };
        Setting.setObject('user', user);
        this.props.dispatch(actions.user_set({ user: user }));
    };

    sideMenuButton_press = () => {
        this.props.dispatch(actions.side_menu_toggle());
    };

    showBackButton() {
        // Note: this is hardcoded for now because navigation.state doesn't tell whether
        // it's possible to go back or not. Maybe it's possible to get this information
        // from somewhere else.
        navigator = this.props.navigator;
        return this.props.navState.routeName != 'Folders';
    }

    backButton_press = () => {
        this.props.navigator.goBack();
    };

    menu_select = value => {
        if (typeof value == 'function') {
            value();
        }
    };

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

        if (this.props.user && this.props.user.session) {
            menuOptionComponents.push(
                <MenuOption
                    value={this.menu_logout}
                    key={'menuOption_' + key++}
                >
                    <Text>{_('Logout')}</Text>
                </MenuOption>
            );
        } else {
            menuOptionComponents.push(
                <MenuOption value={this.menu_login} key={'menuOption_' + key++}>
                    <Text>{_('Login')}</Text>
                </MenuOption>
            );
        }

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
                <Button title="☰" onPress={this.sideMenuButton_press} />
                <Button
                    disabled={!this.showBackButton()}
                    title="<"
                    onPress={this.backButton_press}
                ></Button>
                <Text style={{ flex: 1, marginLeft: 10 }}>{title}</Text>
                <Menu onSelect={this.menu_select}>
                    <MenuTrigger>
                        <Text style={{ fontSize: 20 }}>&#8942;</Text>
                    </MenuTrigger>
                    <MenuOptions>{menuOptionComponents}</MenuOptions>
                </Menu>
            </View>
        );
    }
}

const ScreenHeader = connect(state => {
    return { user: state.nav.user, navigator: state.nav.navigator };
})(ScreenHeaderComponent);

export { ScreenHeader };
