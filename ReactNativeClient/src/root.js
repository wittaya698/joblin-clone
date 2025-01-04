import React from 'react';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { MenuProvider } from 'react-native-popup-menu';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Dropbox } from 'dropbox';

import { Log } from '@/lib/log.js';
import { Folder } from '@/lib/models/folder.js';
import { Database } from '@/lib/database.js';
import { Setting } from '@/lib/models/setting.js';

import { NoteScreen } from '@/lib/components/screens/note.js';
import { NotesScreen } from '@/lib/components/screens/notes.js';
import { FolderScreen } from '@/lib/components/screens/folder.js';
import { FoldersScreen } from '@/lib/components/screens/folders.js';
import { LoginScreen } from '@/lib/components/screens/login.js';
import { LoadingScreen } from '@/lib/components/screens/loading.js';
import { ItemListComponent } from '@/lib/components/item-list.js';
import { BaseModel } from '@/lib/base-model.js';
import { Synchronizer } from '@/lib/synchronizer.js';
import { SideMenuContent } from '@/lib/components/side-menu-content.js';
import { NoteFolderService } from '@/lib/services/note-folder-service.js';
import { DatabaseDriverReactNative } from '@/lib/database-driver-react-native.js';

let defaultState = {
    nav: {},
    navigator: null,
    notes: [],
    folders: [],
    selectedNoteId: null,
    selectedItemType: 'note',
    selectedFolderId: null,
    user: { email: 'wittayathongjeen698@gmail.com', session: null },
    showSideMenu: false
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
            // state.nav = newNav?;
            if ('noteId' in action.payload) {
                state.selectedNoteId = action.payload.noteId;
            }

            if ('folderId' in action.payload) {
                state.selectedFolderId = action.payload.folderId;
            }

            if ('itemType' in action.payload) {
                state.selectedItemType = action.payload.itemType;
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

        side_menu_toggle: (state, action) => {
            state.showSideMenu = !state.showSideMenu;
        },

        side_menu_open: (state, action) => {
            state.showSideMenu = true;
        },

        side_menu_close: (state, action) => {
            state.showSideMenu = false;
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
class HomeStackComponent extends React.Component {
    componentDidMount() {
        let db = new Database(new DatabaseDriverReactNative());
        // db.setDebugMode(false);

        BaseModel.dispatch = this.props.dispatch;
        BaseModel.db_ = db;
        NoteFolderService.dispatch = this.props.dispatch;

        db.open({ name: 'joplin-23.sqlite' })
            .then(() => {
                Log.info('Database is ready.');
            })
            .then(() => {
                Log.info('Loading settings...');
                return Setting.load();
            })
            .then(() => {
                let user = Setting.object('user');

                if (!user || !user.session) {
                    user = {
                        email: 'wittayathongjeen698@gmail.com',
                        session: '96e5b998c9a5025e37f76d4c97ced906'
                    };
                    Setting.setObject('user', user);
                    this.props.dispatch(actions.user_set({ user: user }));
                }

                Setting.setValue('sync.lastRevId', '123456');

                Log.info('Client ID', Setting.value('clientId'));
                Log.info('User', user);

                // this.props.dispatch(actions.user_set({ user: user }));

                Log.info('Loading folders...');

                return Folder.all()
                    .then(folders => {
                        this.props.dispatch(
                            actions.folders_update_all({ folders: folders })
                        );
                        return folders;
                    })
                    .catch(error => {
                        Log.warn('Cannot load folders', error);
                    });
            })
            .then(folders => {
                let folder = folders[0];

                if (!folder) throw new Error('No default folder is defined');

                return NoteFolderService.openNoteList(folder.id);

                // this.props.dispatch({
                // 	type: 'Navigation/NAVIGATE',
                // 	routeName: 'Notes',
                // 	folderId: folder.id,
                // });
            })
            .then(() => {
                var dropboxApi = new Dropbox({ accessToken: '' });
                // dbx.filesListFolder({path: '/Joplin/Laurent.4e847cc'})
                // .then(function(response) {
                // //console.log('DROPBOX RESPONSE', response);
                // console.log('DROPBOX RESPONSE', response.entries.length, response.has_more);
                // })
                // .catch(function(error) {
                // console.log('DROPBOX ERROR', error);
                // });
                // return this.api_;
                // let synchronizer = new Synchronizer(db, Registry.api());
                // let synchronizer = new Synchronizer(db, dropboxApi);
                // Registry.setSynchronizer(synchronizer);
                // synchronizer.start();
            })
            .catch(error => {
                Log.error('Initialization error:', error);
            });
    }

    render() {
        ItemListComponent.dispatch = this.props.dispatch;
        return (
            <MenuProvider>
                <Stack.Navigator initialRouteName="Loading">
                    <Stack.Screen name="Notes" component={NotesScreen} />
                    <Stack.Screen name="Note" component={NoteScreen} />
                    <Stack.Screen name="Folder" component={FolderScreen} />
                    <Stack.Screen name="Folders" component={FoldersScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Loading" component={LoadingScreen} />
                </Stack.Navigator>
            </MenuProvider>
        );
    }
}

export const HomeStack = connect(state => {
    return { nav: state.nav };
})(HomeStackComponent);

const Drawer = createDrawerNavigator();
const App = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <SideMenuContent {...props} />}
        >
            <Drawer.Screen name="Home" component={HomeStack} />
        </Drawer.Navigator>
    );
};

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
