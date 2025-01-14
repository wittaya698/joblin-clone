import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { Checkbox } from '@/lib/components/checkbox.js';
import { Note } from '@/lib/models/note.js';

class ItemListComponent extends Component {
    constructor() {
        super();
        this.state = { dataSource: [], items: [], selectedItemIds: [] };
    }

    UNSAFE_componentWillMount() {
        const newDataSource = Object.assign([], this.props.items);
        this.state = {
            dataSource: newDataSource,
            items: [],
            selectedItemIds: []
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({
            dataSource: Object.assign([], newProps.items)
        });
    }

    async todoCheckbox_change(itemId, checked) {
        let note = await Note.load(itemId);
        await Note.save({ id: note.id, todo_completed: checked });
    }

    listView_itemLongPress(itemId) {}
    listView_itemPress(itemId) {}

    render() {
        let renderRow = item => {
            let onPress = () => {
                this.listView_itemPress(item.id);
            };
            let onLongPress = () => {
                this.listView_itemLongPress(item.id);
            };

            return (
                <TouchableHighlight onPress={onPress} onLongPress={onLongPress}>
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingLeft: 10,
                            paddingTop: 5,
                            paddingBottom: 5
                        }}
                    >
                        {!!Number(item.is_todo) && (
                            <Checkbox
                                checked={!!Number(item.todo_completed)}
                                onChange={checked => {
                                    this.todoCheckbox_change(item.id, checked);
                                }}
                            />
                        )}
                        <Text>{item.title}</Text>
                    </View>
                </TouchableHighlight>
            );
        };

        // `enableEmptySections` is to fix this warning: https://github.com/FaridSafi/react-native-gifted-listview/issues/39
        if (this.state.dataSource.length > 0) {
            return (
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
            );
        } else {
            const noItemMessage = this.props.noItemMessage
                ? this.props.noItemMessage
                : '';
            return <Text>{noItemMessage}</Text>;
        }
    }
}

export { ItemListComponent };
