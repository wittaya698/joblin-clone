import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { Checkbox } from '@/lib/components/checkbox.js';
import { NoteFolderService } from '@/lib/services/note-folder-service.js';

class ItemListComponent extends Component {
    constructor() {
        super();
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
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({
            dataSource: newProps.items
        });
    }

    todoCheckbox_change(itemId, checked) {
        NoteFolderService.setField('note', itemId, 'todo_completed', checked);

        // Note.load(itemId).then(oldNote => {
        //     let newNote = Object.assign({}, oldNote);
        //     newNote.todo_completed = checked;
        //     return NoteFolderService.save('note', newNote, oldNote);
        // });
    }

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
                    <View style={{ flexDirection: 'row' }}>
                        {!!Number(item.is_todo) && (
                            <Checkbox
                                checked={!!Number(item.todo_completed)}
                                onChange={checked => {
                                    this.todoCheckbox_change(item.id, checked);
                                }}
                            />
                        )}
                        <Text>
                            {item.title}[{item.id}]
                        </Text>
                    </View>
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
