const React = require('react');
const { Component } = React;
const { FlatList, View, Text, Button, StyleSheet } = require('react-native');
const { connect } = require('react-redux');
const { Log } = require('lib/log.js');
const { reg } = require('lib/registry.js');
const { ScreenHeader } = require('lib/components/screen-header.js');
const { time } = require('lib/time-utils');
const { themeStyle } = require('lib/components/global-style.js');
const { Logger } = require('lib/logger.js');
const { BaseScreenComponent } = require('lib/components/base-screen.js');
const { _ } = require('lib/locale.js');

class LogScreenComponent extends BaseScreenComponent {
    static navigationOptions(options) {
        return { header: null };
    }

    constructor() {
        super();
        this.state = {
            dataSource: []
        };
        this.styles_ = {};
    }

    styles() {
        const theme = themeStyle(this.props.theme);

        if (this.styles_[this.props.theme])
            return this.styles_[this.props.theme];
        this.styles_ = {};

        let styles = {
            row: {
                flexDirection: 'row',
                paddingLeft: 1,
                paddingRight: 1,
                paddingTop: 0,
                paddingBottom: 0
            },
            rowText: {
                fontFamily: 'monospace',
                fontSize: 10,
                color: theme.color
            }
        };

        styles.rowTextError = Object.assign({}, styles.rowText);
        styles.rowTextError.color = theme.colorError;

        styles.rowTextWarn = Object.assign({}, styles.rowText);
        styles.rowTextWarn.color = theme.colorWarn;

        this.styles_[this.props.theme] = StyleSheet.create(styles);
        return this.styles_[this.props.theme];
    }

    UNSAFE_componentWillMount() {
        this.resfreshLogEntries();
    }

    resfreshLogEntries() {
        reg.logger()
            .lastEntries(1000)
            .then(entries => {
                const newDataSource = Object.assign([], entries);
                this.setState({ dataSource: newDataSource });
            });
    }

    render() {
        let renderRow = item => {
            let textStyle = this.styles().rowText;
            if (item.level == Logger.LEVEL_WARN)
                textStyle = this.styles().rowTextWarn;
            if (item.level == Logger.LEVEL_ERROR)
                textStyle = this.styles().rowTextError;

            return (
                <View style={this.styles().row}>
                    <Text style={textStyle}>
                        {time.formatMsToLocal(
                            item.timestamp,
                            'MM-DDTHH:mm:ss'
                        ) +
                            ': ' +
                            item.message}
                    </Text>
                </View>
            );
        };

        // `enableEmptySections` is to fix this warning: https://github.com/FaridSafi/react-native-gifted-listview/issues/39
        return (
            <View style={this.rootStyle(this.props.theme).root}>
                <ScreenHeader title={_('Log')} />
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
                <Button
                    title={_('Refresh')}
                    onPress={() => {
                        this.resfreshLogEntries();
                    }}
                />
            </View>
        );
    }
}

const LogScreen = connect(state => {
    return { theme: state.settings.theme };
})(LogScreenComponent);

module.exports = { LogScreen };
