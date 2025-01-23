import { Component } from 'react';
import {
    FlatList,
    Text,
    TouchableHighlight,
    View,
    StyleSheet
} from 'react-native';
import { Checkbox } from '@/lib/components/checkbox.js';
import { reg } from '@/lib/registry.js';
import { Note } from '@/lib/models/note.js';
import { time } from '@/lib/time-utils.js';
import { globalStyle } from '@/lib/components/global-style.js';

const styles = StyleSheet.create({
    listItem: {
        flexDirection: 'row',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: globalStyle.dividerColor,
        alignItems: 'center',
        paddingLeft: globalStyle.marginLeft,
        backgroundColor: globalStyle.backgroundColor
    }
});

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
        await Note.save({
            id: note.id,
            todo_completed: checked ? time.unixMs() : 0
        });
        reg.scheduleSync();
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

            const listItemStyle = { color: globalStyle.color };
            const checkboxStyle = Object.assign({}, listItemStyle);
            if (!Number(item.is_todo)) checkboxStyle.display = 'none';

            const checkboxChecked = !!Number(item.todo_completed);

            return (
                <TouchableHighlight
                    onPress={onPress}
                    onLongPress={onLongPress}
                    underlayColor="#0066FF"
                >
                    <View style={styles.listItem}>
                        <Checkbox
                            style={checkboxStyle}
                            checked={checkboxChecked}
                            onChange={checked => {
                                this.todoCheckbox_change(item.id, checked);
                            }}
                        />
                        <Text style={listItemStyle}>{item.title}</Text>
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
