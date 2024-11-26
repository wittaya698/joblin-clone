import React, { Component } from 'react';
import { Button, TextInput, View } from 'react-native';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';
import { ItemList } from '@/src/components/item-list';

import { Log } from '@/src/log';
import { Note } from '@/src/models/note';

let defaultState = {
    defaultText: 'bla',
    notes: [
        {
            id: 1,
            title: 'hello',
            body: 'just testing\nmultiple\nlines'
        },
        {
            id: 2,
            title: 'hello2',
            body: '2 just testing\nmultiple\nlines'
        },
        {
            id: 3,
            title: 'hello3',
            body: '3 just testing\nmultiple\nlines'
        },
        {
            id: 4,
            title: 'hello4',
            body: '4 just testing\nmultiple\nlines'
        }
    ],
    selectedNoteId: null
};

const navReducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        navigate: () => {},
        back: (state, action) => {
            // const nextStateNav = AppNavigator.router.getStateForAction(action, state.nav);
            // newState = Object.assign({}, state);
            // if (nextStateNav) {
            // 	newState.nav = nextStateNav;
            // }

            // if (action.noteId) {
            // 	newState.selectedNoteId = action.noteId;
            // }
            action.payload.navigation.goBack();
        },
        view_note: () => {}
    }
});

export const { reducer, actions } = navReducer;

const store = configureStore({
    reducer: {
        nav: reducer
    }
});

class NotesScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Notes'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <ItemList style={{ flex: 1 }} />
                <Button title="Create note" onPress={() => navigate('Note')} />
            </View>
        );
    }
}

const NotesScreen = connect(
    state => {
        return {};
    },
    dispatch => {
        return {};
    }
)(NotesScreenComponent);

class NoteScreenComponent extends React.Component {
    static navigationOptions = {
        title: 'Note'
    };

    constructor() {
        super();
        this.state = { note: Note.newNote() };
    }

    // componentWillMount() {
    //     this.setState({ note: this.props.note });
    // }

    noteComponent_onChange = (propName, propValue) => {
        this.setState((prevState, props) => {
            let note = Object.assign({}, prevState.note);
            note[propName] = propValue;
            return { note: note };
        });
    };

    title_onChangeText = text => {
        this.noteComponent_onChange('title', text);
    };

    body_onChangeText = text => {
        this.noteComponent_onChange('body', text);
    };

    render() {
        let note = this.props.note;

        let onSaveButtonPress = () => {
            return this.props.onSaveButtonPress(this.state.note);
        };
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    value={this.state.note.title}
                    onChangeText={this.title_onChangeText}
                />
                <TextInput
                    style={{ flex: 1, textAlignVertical: 'top' }}
                    multiline={true}
                    value={this.state.note.body}
                    onChangeText={this.body_onChangeText}
                />
                <Button title="Save note" onPress={onSaveButtonPress} />
            </View>
        );
    }
}

const NoteScreen = connect(
    state => {
        return {
            note: state.nav.selectedNoteId
                ? Note.noteById(state.nav.notes, state.nav.selectedNoteId)
                : Note.newNote(),
            onSaveButtonPress: note => {
                Log.info(note);
            }
        };
    },
    dispatch => {
        return {};
    }
)(NoteScreenComponent);

const Stack = createStackNavigator();
class AppNavigator extends React.Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
            </Stack.Navigator>
        );
    }
}

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        );
    }
}

export { Root };
