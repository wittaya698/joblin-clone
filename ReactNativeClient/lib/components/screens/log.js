import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { reg } from '@/lib/registry.js';
import { ScreenHeader } from '@/lib/components/screen-header.js';
import { time } from '@/lib/time-utils';

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
        reg.logger()
            .lastEntries(1000)
            .then(entries => {
                const newDataSource = Object.assign([], entries);
                this.setState({ dataSource: newDataSource });
            });
    }

    render() {
        let renderRow = item => {
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
                    <Text style={{ fontFamily: 'monospace', fontSize: 10 }}>
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
            <View>
                <ScreenHeader navState={{ routeName: routeName }} />
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
            </View>
        );
    }
}

const LogScreen = connect(state => {
    return {};
})(LogScreenComponent);

export { LogScreen };
