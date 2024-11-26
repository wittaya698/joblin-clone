import { Button } from 'react-native';
import { connect } from 'react-redux';
import { inc_counter } from '../../index.android';
import { _ } from '@/src/locale';

const { Component } = require('react');

class LoginButtonComponent extends Component {
    render() {
        return <Button onPress={this.props.onPress} title={_('Login')} />;
    }
}

const LoginButton = connect(
    state => {
        return {};
        // return { label: state.counter.myButtonLabel };
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
