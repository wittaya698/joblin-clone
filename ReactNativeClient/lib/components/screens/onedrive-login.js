import React, { Component } from 'react';
import { View, Button, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { Setting } from '@/lib/models/setting.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { reg } from '@/lib/registry.js';
import { _ } from '@/lib/locale.js';
import { BaseScreenComponent } from '@/lib/components/base-screen.js';
import { actions } from '@/root.js';

class OneDriveLoginScreenComponent extends BaseScreenComponent {
    static navigationOptions(options) {
        return { header: null };
    }

    constructor() {
        super();
        this.state = { webviewUrl: '' };
        this.authCode_ = null;
    }

    UNSAFE_componentWillMount() {
        this.setState({
            webviewUrl: this.startUrl()
        });
    }

    startUrl() {
        return reg.oneDriveApi().authCodeUrl(this.redirectUrl());
    }

    redirectUrl() {
        return 'https://login.microsoftonline.com/common/oauth2/nativeclient';
    }

    async webview_load(noIdeaWhatThisIs) {
        // This is deprecated according to the doc but since the non-deprecated property (source)
        // doesn't exist, use this for now. The whole component is completely undocumented
        // at the moment so it's likely to change.
        const url = noIdeaWhatThisIs.url;

        if (
            !this.authCode_ &&
            url.indexOf(this.redirectUrl() + '?code=') === 0
        ) {
            Log.info('URL: ' + url);

            let code = url.split('?code=');
            code = code[1].split('&session_state');
            this.authCode_ = code[0];

            try {
                await reg
                    .oneDriveApi()
                    .execTokenRequest(this.authCode_, this.redirectUrl(), true);
                this.props.dispatch(actions.navigate({ routeName: 'Back' }));
                reg.scheduleSync(0);
            } catch (error) {
                alert(error.message);
            }

            this.authCode_ = null;
        }
    }

    async webview_error(error) {
        Log.error(error);
    }

    retryButton_click() {
        // It seems the only way it would reload the page is by loading an unrelated
        // URL, waiting a bit, and then loading the actual URL. There's probably
        // a better way to do this.

        this.setState({
            webviewUrl: 'https://microsoft.com'
        });
        this.forceUpdate();

        setTimeout(() => {
            this.setState({
                webviewUrl: this.startUrl()
            });
            this.forceUpdate();
        }, 1000);
    }

    render() {
        const source = {
            uri: this.state.webviewUrl
        };

        return (
            <View style={this.styles().screen}>
                <ScreenHeader title={_('Login with OneDrive')} />
                <WebView
                    source={source}
                    onNavigationStateChange={o => {
                        this.webview_load(o);
                    }}
                    onError={error => {
                        this.webview_error(error);
                    }}
                />

                <Button
                    title="Retry"
                    onPress={() => {
                        this.retryButton_click();
                    }}
                ></Button>
            </View>
        );
    }
}

const OneDriveLoginScreen = connect(state => {
    return {};
})(OneDriveLoginScreenComponent);
export { OneDriveLoginScreen };
