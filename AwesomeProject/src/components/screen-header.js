import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Log } from '@/src/log.js';
import { _ } from '@/src/locale.js';
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
    static defaultProps = {
        menuOptions: []
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
        let menuOptionComponents = [];
        for (let i = 0; i < this.props.menuOptions.length; i++) {
            let o = this.props.menuOptions[i];
            let key = 'menuOption_' + i;
            menuOptionComponents.push(
                <MenuOption value={o.onPress} key={key}>
                    <Text>{o.title}</Text>
                </MenuOption>
            );
            if (i == this.props.menuOptions.length - 1) {
                menuOptionComponents.push(
                    <View key={'menuDivider_' + i} style={styles.divider} />
                );
            }
        }

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
                    <MenuOptions>
                        {menuOptionComponents}
                        <MenuOption value={1}>
                            <Text>{_('Configuration')}</Text>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
        );
    }
}

const ScreenHeader = connect(state => {
    return { navigator: state.nav.navigator };
})(ScreenHeaderComponent);

export { ScreenHeader };
