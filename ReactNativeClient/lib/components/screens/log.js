import React, { Component } from 'react';
import { FlatList, View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { reg } from '@/lib/registry.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { time } from '@/lib/time-utils';
import { Logger } from '@/lib/logger.js';

class LogScreenComponent extends React.Component {
    static navigationOptions(options) {
        return { header: null };
    }

    constructor() {
        super();
        this.state = {
            dataSource: []
        };
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
            let color = 'black';
            if (item.level == Logger.LEVEL_WARN) color = '#9A5B00';
            if (item.level == Logger.LEVEL_ERROR) color = 'red';

            let style = {
                fontFamily: 'monospace',
                fontSize: 10,
                color: color
            };
            return (
                <View
                    style={{
                        flexDirection: 'row',
                        paddingLeft: 1,
                        paddingRight: 1,
                        paddingTop: 0,
                        paddingBottom: 0
                    }}
                >
                    <Text style={style}>
                        {time.unixMsToIsoSec(item.timestamp) +
                            ': ' +
                            item.message}
                    </Text>
                </View>
            );
        };

        nav = this.props.navigation;
        routeName = nav.getState().routes[nav.getState().index].name;

        // `enableEmptySections` is to fix this warning: https://github.com/FaridSafi/react-native-gifted-listview/issues/39
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
                <Button
                    title="Refresh"
                    onPress={() => {
                        this.resfreshLogEntries();
                    }}
                />
            </View>
        );
    }
}

const LogScreen = connect(state => {
    return {};
})(LogScreenComponent);

export { LogScreen };
