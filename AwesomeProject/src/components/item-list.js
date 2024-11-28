import { Component } from 'react';
import { FlatList, Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import { actions } from '@/src/root';
import { Log } from '@/src/log';

class ItemListComponent extends Component {
    constructor() {
        super();
        this.state = { dataSource: {} };
    }

    UNSAFE_componentWillMount() {
        const newDataSource = this.props.notes;
        this.state = { dataSource: newDataSource };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        // https://stackoverflow.com/questions/38186114/react-native-redux-and-listview
        this.setState({ dataSource: newProps.notes });
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

const ItemList = connect(
    state => {
        return { notes: state.nav.notes };
    },
    dispatch => {
        return {
            onItemClick: noteId => {
                dispatch(actions.navigate({ routeName: 'Note', id: noteId }));
            }
        };
    }
)(ItemListComponent);

export { ItemList };
