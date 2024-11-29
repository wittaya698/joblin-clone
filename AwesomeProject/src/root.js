import React from 'react';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';

import { Log } from '@/src/log';
import { Database } from '@/src/database';
import { Registry } from '@/src/registry';
import { Note } from '@/src/models/note';
import { Setting } from '@/src/models/setting';

import { NoteScreen } from '@/src/components/screens/note';
import { NotesScreen } from '@/src/components/screens/notes';
import { FolderScreen } from '@/src/components/screens/folder';
import { LoginScreen } from '@/src/components/screens/login';
import { useNavigation } from '@react-navigation/native';

let defaultState = {
    defaultText: 'bla',
    notes: [],
    folders: [
        { id: 'abcdabcdabcdabcdabcdabcdabcdab01', title: 'un' },
        { id: 'abcdabcdabcdabcdabcdabcdabcdab02', title: 'deux' },
        { id: 'abcdabcdabcdabcdabcdabcdabcdab03', title: 'trois' },
        { id: 'abcdabcdabcdabcdabcdabcdabcdab04', title: 'quatre' }
    ],
    selectedNoteId: null,
    selectedFolderId: null
};

const navReducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        navigate: (state, action) => {
            const route = action.payload.route;
            const note_id = action.payload.noteId
                ? action.payload.noteId
                : null;
            state.selectedNoteId = note_id;
            action.payload.navigation.navigate(route, { noteId: note_id });
        },
        back: (state, action) => {
            // // If the current screen is already the requested screen, don't do anything
            // const r = state.nav.routes;
            // if (r.length && r[r.length - 1].routeName == action.routeName) {
            // 	return state
            // }

            // const nextStateNav = AppNavigator.router.getStateForAction(action, state.nav);
            // Log.info('NEXT', nextStateNav);
            // newState = Object.assign({}, state);
            // if (nextStateNav) {
            // 	newState.nav = nextStateNav;
            // }

            // if (action.payload.noteId) {
            // 	newState.selectedNoteId = action.payload.noteId;
            // }
            // state = newState;

            action.payload.navigation.goBack();
        },
        // Replace all the notes with the provided array
        notes_update_all: (state, action) => {
            state.notes = action.payload.notes;
        },
        // Insert the note into the note list if it's new, or
        // update it if it already exists.
        notes_update_one: (state, action) => {
            let newNotes = state.notes.splice(0);
            var found = false;
            for (let i = 0; i < newNotes.length; i++) {
                let n = newNotes[i];
                if (n.id == action.payload.note.id) {
                    newNotes[i] = action.payload.note;
                    found = true;
                    break;
                }
            }

            if (!found) newNotes.push(action.payload.note);

            state.notes = newNotes;
        },

        folder_update_one: (state, action) => {
            let newFolders = state.folders.splice(0);
            var found = false;
            for (let i = 0; i < newFolders.length; i++) {
                let n = newFolders[i];
                if (n.id == action.payload.folder.id) {
                    newFolders[i] = action.payload.folder;
                    found = true;
                    break;
                }
            }

            if (!found) newFolders.push(action.payload.folder);

            state.folders = newFolders;
        }
    }
});

export const { reducer, actions } = navReducer;

const store = configureStore({
    reducer: {
        nav: reducer
    }
});

const Stack = createStackNavigator();
class AppComponent extends React.Component {
    componentDidMount() {
        let db = new Database();
        db.setDebugEnabled(Registry.debugMode());
        props = this.props;

        db.open()
            .then(() => {
                Log.info('Database is ready.');
                Registry.setDb(db);
            })
            .then(() => {
                Log.info('Loading settings...');
                return Setting.load();
            })
            .then(() => {
                Log.info('Client ID', Setting.value('clientId'));
                Log.info('Loading notes...');
                Note.previews()
                    .then(notes => {
                        props.notes_update_all(notes);
                    })
                    .catch(error => {
                        Log.warn('Cannot load notes', error);
                    });
            })
            .catch(error => {
                Log.error('Cannot initialize database:', error);
            });
    }

    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
                <Stack.Screen name="Folder" component={FolderScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
            </Stack.Navigator>
        );
    }
}

const App = connect(
    state => {},
    dispatch => {
        return {
            notes_update_all: function (notes) {
                dispatch(actions.notes_update_all({ notes: notes }));
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
