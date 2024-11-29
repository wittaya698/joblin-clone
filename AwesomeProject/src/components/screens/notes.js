import React from 'react';
import { View, Button } from 'react-native';
import { connect } from 'react-redux';
import { Log } from '@/src/log.js';
import { ItemList } from '@/src/components/item-list.js';
import { actions } from '@/src/root';

class NotesScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Notes'
    };

    createNoteButton_press = () => {
        const { navigate } = this.props.navigation;
        navigate('Note');
    };

    loginButton_press = () => {
        this.props.dispatch(go_to_login({ routeName: 'Login' }));
    };

    syncButton_press = () => {
        Log.info('SYNC');
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <ItemList style={{ flex: 1 }} />
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        title="Create note"
                        onPress={this.createNoteButton_press}
                    />
                    <Button title="Login" onPress={this.loginButton_press} />
                    <Button title="Sync" onPress={this.syncButton_press} />
                </View>
            </View>
        );
    }
}

const NotesScreen = connect(
    state => {
        return {};
    },
    dispatch => {
        return {
            go_to_login: function (routeName) {
                dispatch(actions.navigate({ routeName: routeName }));
            }
        };
    }
)(NotesScreenComponent);

export { NotesScreen };
