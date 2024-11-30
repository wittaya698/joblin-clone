import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { actions } from '../root';

class ItemListComponent extends Component {
    static dispatch = null;

    constructor() {
        super();
        this.previousListMode = 'view';
        this.state = { dataSource: {}, items: [], selectedItemIds: [] };
    }

    UNSAFE_componentWillMount() {
        this.state = {
            dataSource: this.props.items,
            items: [],
            selectedItemIds: []
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // When the items have changed, we just pass this to the data source. However,
        // when the list mode change, we need to clone the items to make sure the whole
        // list is updated (so that the checkbox can be added or removed).
        let items = newProps.items;

        if (newProps.listMode != this.previousListMode) {
            items = newProps.items.slice();
            for (let i = 0; i < items.length; i++) {
                items[i] = Object.assign({}, items[i]);
            }
            this.previousListMode = newProps.listMode;
        }

        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({
            dataSource: newProps.items
        });
    }

    setListMode = mode => {
        ItemListComponent.dispatch(actions.set_list_mode({ listMode: mode }));
    };

    listView_itemPress = itemId => {};

    listView_itemLongPress = itemId => {
        this.setListMode('edit');
    };

    render() {
        let renderRow = item => {
            let onPress = () => {
                this.listView_itemPress(item.id);
            };
            let onLongPress = () => {
                this.listView_itemLongPress(item.id);
            };
            let editable = this.props.listMode == 'edit' ? ' [X] ' : '';

            return (
                <TouchableHighlight onPress={onPress} onLongPress={onLongPress}>
                    <Text>
                        {item.title}
                        <Text>{editable}</Text>
                    </Text>
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
