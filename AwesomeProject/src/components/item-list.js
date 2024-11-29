import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';

class ItemListComponent extends Component {
    constructor() {
        super();
        this.state = { dataSource: {} };
    }

    UNSAFE_componentWillMount() {
        const newDataSource = this.props.items;
        this.state = { dataSource: newDataSource };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({ dataSource: newProps.items });
    }

    listView_itemClick = itemId => {};

    render() {
        let renderRow = rowData => {
            let onPress = () => {
                this.listView_itemClick(rowData.id);
            };
            return (
                <TouchableHighlight onPress={onPress}>
                    <Text>{rowData.title}</Text>
                </TouchableHighlight>
            );
        };

        // `enableEmptySections` is to fix this warning: https://github.com/FaridSafi/react-native-gifted-listview/issues/39
        return (
            <View>
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
                ;
            </View>
        );
    }
}

export { ItemListComponent };
