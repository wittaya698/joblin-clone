import { Component } from 'react';
import {
    FlatList,
    Text,
    TouchableHighlight,
    View,
    StyleSheet
} from 'react-native';
import { Checkbox } from '@/lib/components/checkbox.js';
import { NoteItem } from '@/lib/components/note-item.js';
import { reg } from '@/lib/registry.js';
import { Note } from '@/lib/models/note.js';
import { Setting } from '@/lib/models/setting.js';
import { time } from '@/lib/time-utils.js';
import { globalStyle } from '@/lib/components/global-style.js';

const styles = StyleSheet.create({
    noItemMessage: {
        paddingLeft: globalStyle.marginLeft,
        paddingRight: globalStyle.marginRight,
        paddingTop: globalStyle.marginTop,
        paddingBottom: globalStyle.marginBottom
    }
});

class ItemListComponent extends Component {
    constructor() {
        super();
        this.state = { dataSource: [], items: [], selectedItemIds: [] };
    }

    filterNotes(notes) {
        const todoFilter = Setting.value('todoFilter');
        if (todoFilter == 'all') return notes;

        const now = time.unixMs();
        const maxInterval = 1000 * 60 * 60 * 24 * 2;

        const notRecentTime = now - maxInterval;

        let output = [];
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            if (note.is_todo) {
                if (todoFilter == 'recent' && note.updated_time < notRecentTime)
                    continue;
                if (todoFilter == 'nonCompleted' && !!note.todo_completed)
                    continue;
            }
            output.push(note);
        }
        return output;
    }

    UNSAFE_componentWillMount() {
        const newDataSource = Object.assign(
            [],
            this.filterNotes(this.props.items)
        );
        this.state = {
            dataSource: newDataSource,
            items: [],
            selectedItemIds: []
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({
            dataSource: Object.assign([], this.filterNotes(newProps.items))
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
        // `enableEmptySections` is to fix this warning: https://github.com/FaridSafi/react-native-gifted-listview/issues/39
        if (this.state.dataSource.length > 0) {
            return (
                <FlatList
                    data={this.state.dataSource}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => {
                        return (
                            <NoteItem
                                note={item}
                                onPress={note =>
                                    this.listView_itemPress(note.id)
                                }
                                onCheckboxChange={(note, checked) =>
                                    this.todoCheckbox_change(note.id, checked)
                                }
                            />
                        );
                    }}
                />
            );
        } else {
            const noItemMessage = this.props.noItemMessage
                ? this.props.noItemMessage
                : '';
            return <Text style={styles.noItemMessage}>{noItemMessage}</Text>;
        }
    }
}

export { ItemListComponent };
