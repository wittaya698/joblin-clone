import React from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { connect } from 'react-redux';

import { Log } from '@/src/log';
import { Registry } from '@/src/registry';
import { Setting } from '@/src/models/setting';
import { ScreenHeader } from '@/src/components/screen-header';
import { _ } from '@/src/locale';

class LoginScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    constructor() {
        super();
        this.state = { username: '', password: '', errorMessage: null };
    }

    email_changeText = text => {
        this.setState({ email: text });
    };

    password_changeText = text => {
        this.setState({ password: text });
    };

    loginButton_press = () => {
        this.setState({ errorMessage: null });

        return Registry.api()
            .post('sessions', null, {
                email: this.state.email,
                password: this.state.password,
                client_id: Setting.value('clientId')
            })
            .then(session => {
                Log.info('GOT DATA:');
                Log.info(session);
            })
            .catch(error => {
                this.setState({
                    errorMessage: _('Could not login: %s)', error.message)
                });
            });
    };

    render() {
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
                <TextInput
                    value={this.state.email}
                    onChangeText={this.email_changeText}
                    keyboardType="email-address"
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={this.password_changeText}
                    secureTextEntry={true}
                />
                {this.state.errorMessage && (
                    <Text style={{ color: '#ff0000' }}>
                        {this.state.errorMessage}
                    </Text>
                )}
                <Button title="Login" onPress={this.loginButton_press} />
            </View>
        );
    }
}

const LoginScreen = connect(state => {
    return {};
})(LoginScreenComponent);

export { LoginScreen };
