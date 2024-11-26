import { Button } from 'react-native';
import { connect } from 'react-redux';
import { inc_counter } from '../../index.android';

const { Component } = require('react');

class LoginButtonComponent extends Component {
    render() {
        return <Button onPress={this.props.onPress} title={this.props.label} />;
    }
}

const LoginButton = connect(
    state => {
        return { label: state.counter.myButtonLabel };
    },
    dispatch => {
        return {
            onPress: function () {
                dispatch(inc_counter());
            }
        };
    }
)(LoginButtonComponent);

export { LoginButton };
