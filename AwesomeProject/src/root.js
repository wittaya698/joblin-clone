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
        notes_loaded: (state, action) => {
            state.notes = action.payload.notes;
        },
        save_note: () => {}
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

    UNSAFE_componentWillMount() {
        this.setState({ note: this.props.note });
    }

    noteComponent_change = (propName, propValue) => {
        this.setState((prevState, props) => {
            let note = Object.assign({}, prevState.note);
            note[propName] = propValue;
            return { note: note };
        });
    };

    title_changeText = text => {
        this.noteComponent_change('title', text);
    };

    body_changeText = text => {
        this.noteComponent_change('body', text);
    };

    saveNoteButton_press = () => {
        // TODO: if state changes are asynchronous, how to be sure that, when
        // the button is presssed, this.state.note contains the actual note?
        // - Save to database
        // - Dispatch "noteSaved" when done
        // -* Move i^p on state

        Note.save(this.state.note)
            .then(() => {
                Log.info('NOTE_INSERTED');
            })
            .catch(error => {
                Log.warn('CANNOT INSERT NOTE', error);
            });

        // this.props.dispatch({
        // 	type: 'SAVE_NOTE',
        // 	note: this.state.note,
        // });
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    value={this.state.note.title}
                    onChangeText={this.title_changeText}
                />
                <TextInput
                    style={{ flex: 1, textAlignVertical: 'top' }}
                    multiline={true}
                    value={this.state.note.body}
                    onChangeText={this.body_changeText}
                />
                <Button title="Save note" onPress={this.saveNoteButton_press} />
            </View>
        );
    }
}

const NoteScreen = connect(state => {
    return {
        note: state.nav.selectedNoteId
            ? Note.noteById(state.nav.notes, state.nav.selectedNoteId)
            : Note.newNote()
    };
})(NoteScreenComponent);

const Stack = createStackNavigator();
class AppComponent extends React.Component {
    componentDidMount() {
        props = this.props;
        Note.previews()
            .then(notes => {
                props.notes_loaded(notes);
            })
            .catch(error => {
                Log.warn('Cannot load notes', error);
            });
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
            </Stack.Navigator>
        );
    }
}

const App = connect(
    state => {},
    dispatch => {
        return {
            notes_loaded: function (notes) {
                dispatch(actions.notes_loaded({ notes: notes }));
            }
        };
    }
)(AppComponent);

class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        );
    }
}

export { Root };
