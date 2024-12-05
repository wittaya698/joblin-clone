import React from 'react';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';

import { Log } from '@/src/log';
import { Folder } from '@/src/models/folder';
import { Database } from '@/src/database';
import { Registry } from '@/src/registry';
import { Setting } from '@/src/models/setting';

import { NoteScreen } from '@/src/components/screens/note';
import { NotesScreen } from '@/src/components/screens/notes';
import { FolderScreen } from '@/src/components/screens/folder';
import { FoldersScreen } from '@/src/components/screens/folders';
import { LoginScreen } from '@/src/components/screens/login';
import { ItemListComponent } from './components/item-list';
import { BaseModel } from '@/src/base-model';
import { Synchronizer } from '@/src/synchronizer';

let defaultState = {
    nav: {},
    navigator: null,
    notes: [],
    folders: [],
    selectedNoteId: null,
    selectedFolderId: null,
    listMode: 'view',
    user: { email: 'wittayathongjeen698@gmail.com', session: null }
};

const navReducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        set_navigator: (state, action) => {
            state.navigator = action.payload.navigator;
        },
        navigate: (state, action) => {
            // const r = state.nav.routes;

            action.params = { listMode: 'view' };

            // state.nav = newNav?;
            if ('noteId' in action.payload) {
                state.selectedNoteId = action.payload.noteId;
            }

            if ('folderId' in action.payload) {
                state.selectedFolderId = action.payload.folderId;
            }
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

        folders_update_all: (state, action) => {
            state.folders = action.payload.folders;
        },

        folders_update_one: (state, action) => {
            var newFolders = state.folders.splice(0);
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
        },

        folder_delete: (state, action) => {
            var newFolders = [];
            for (let i = 0; i < state.folders.length; i++) {
                let f = state.folders[i];
                if (f.id == action.payload.folderId) continue;
                newFolders.push(f);
            }

            state.folders = newFolders;
        },

        user_set: (state, action) => {
            state.user = action.payload.user;
        },

        set_list_mode: (state, action) => {
            state.listMode = action.payload.listMode;
            // state.nav = Object.assign({}, state.nav)
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
        // db.setDebugEnabled(Registry.debugMode());
        db.setDebugEnabled(false);

        BaseModel.dispatch = this.props.dispatch;
        BaseModel.db_ = db;

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
                let user = Setting.object('user');
                Log.info('Client ID', Setting.value('clientId'));
                Log.info('User', user);

                Registry.api().setSession(user.session);

                this.props.dispatch(actions.user_set({ user: user }));

                Log.info('Loading folders...');

                Folder.all()
                    .then(folders => {
                        props.dispatch(
                            actions.folders_update_all({ folders: folders })
                        );
                    })
                    .catch(error => {
                        Log.warn('Cannot load folders', error);
                    });
            })
            .then(() => {
                // db.executeSql('DELETE FROM folders');
                // db.executeSql('DELETE FROM changes');
                let synchronizer = new Synchronizer(db, Registry.api());
                synchronizer.start();
            })
            .catch(error => {
                Log.error('Initialization error:', error);
            });
    }

    render() {
        ItemListComponent.dispatch = this.props.dispatch;
        return (
            <MenuProvider>
                <Stack.Navigator initialRouteName="Folders">
                    <Stack.Screen name="Notes" component={NotesScreen} />
                    <Stack.Screen name="Note" component={NoteScreen} />
                    <Stack.Screen name="Folder" component={FolderScreen} />
                    <Stack.Screen name="Folders" component={FoldersScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </Stack.Navigator>
            </MenuProvider>
        );
    }
}

const App = connect(state => {
    return { nav: state.nav };
})(AppComponent);

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
