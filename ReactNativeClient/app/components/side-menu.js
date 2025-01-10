import { Component } from 'react';
import { connect } from 'react-redux';

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
