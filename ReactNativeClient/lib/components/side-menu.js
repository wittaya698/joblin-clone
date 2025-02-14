const { Component } = require('react');
const { connect } = require('react-redux');

class SideMenuComponent extends Component {
    constructor(props) {
        super(props);
    }
}

const MySideMenu = connect(state => {
    return {
        isOpen: state.showSideMenu
    };
})(SideMenuComponent);

module.export = { SideMenu: MySideMenu };
