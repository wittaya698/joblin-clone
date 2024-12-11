import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Log } from '@/src/log.js';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeStack } from '@/src/root';
import { SideMenuContent } from '@/src/components/side-menu-content';

const Drawer = createDrawerNavigator();

class SideMenuComponent extends Component {
    constructor(props) {
        super(props);
    }
}

const SideMenu = connect(state => {
    return {
        isOpen: state.nav.showSideMenu
    };
})(SideMenuComponent);

export { SideMenu };
