import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { view_note } from '@/src/root';

class ItemListComponent extends Component {
    constructor() {
        super();
        // const ds = new FlatList();
        // this.state = { dataSource: ds };
    }

    UNSAFE_componentWillMount() {
        // const newDataSource = this.state.dataSource.cloneWithRows(
        //     this.props.notes
        // );
        // this.state = { dataSource: newDataSource };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // TODO: use this to update:
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
    }

    render() {
        let renderRow = rowData => {
            let onPress = () => {
                this.props.onItemClick(rowData.id);
            };
            return (
                <TouchableHighlight onPress={onPress}>
                    <Text>{rowData.title}</Text>
                </TouchableHighlight>
            );
        };
        return (
            <View>
                <FlatList
                    data={this.props.notes}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => renderRow(item)}
                />
                ;
            </View>
        );
    }
}

const ItemList = connect(
    state => {
        return { notes: state.nav.notes };
    },
    dispatch => {
        return {
            onItemClick: noteId => {
                dispatch(view_note({ id: noteId }));
            }
        };
    }
)(ItemListComponent);

export { ItemList };
