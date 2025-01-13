import React from 'react';
import { View, Button, TextInput } from 'react-native';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { shim } from '@/lib/shim.js';
import { Log } from '@/lib/log.js';
import { Note } from '@/lib/models/note.js';
import { Folder } from '@/lib/models/folder.js';
import { Resource } from '@/lib/models/resource.js';
import { Tag } from '@/lib/models/tag.js';
import { NoteTag } from '@/lib/models/note-tag.js';
import { BaseItem } from '@/lib/models/base-item.js';
import { BaseModel } from '@/lib/base-model.js';
import { Database } from '@/lib/database.js';
import { JoplinDatabase } from '@/lib/joplin-database.js';
import { ItemList } from '@/lib/components/item-list.js';
import { NotesScreen } from '@/lib/components/screens/notes.js';
import { NotesScreenUtils } from '@/lib/components/screens/notes-utils.js';
import { NoteScreen } from '@/lib/components/screens/note.js';
import { FolderScreen } from '@/lib/components/screens/folder.js';
import { FoldersScreen } from '@/lib/components/screens/folders.js';
import { LoginScreen } from '@/lib/components/screens/login.js';
import { LoadingScreen } from '@/lib/components/screens/loading.js';
import { OneDriveLoginScreen } from '@/lib/components/screens/onedrive-login.js';
import { Setting } from '@/lib/models/setting.js';
import { Synchronizer } from '@/lib/synchronizer.js';
import { MenuProvider } from 'react-native-popup-menu';
import { SideMenuContent } from '@/lib/components/side-menu-content.js';
import { DatabaseDriverReactNative } from '@/lib/database-driver-react-native.js';
import { reg } from '@/lib/registry.js';
import RNFS from 'react-native-fs';

import { Dropbox } from 'dropbox';

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
    async componentDidMount() {
        shim.fetchBlob = async function (url, option) {
            if (!options || !options.path)
                throw new Error('fetchBlob: target file path is missing');
            if (!options.method) options.method = 'GET';

            let headers = options.headers ? options.headers : {};
            let method = options.method ? options.method : 'GET';

            let dirs = RNFetchBlob.fs.dirs;
            let localFilePath = options.path;
            if (localFilePath.indexOf('/') !== 0)
                localFilePath = dirs.DocumentDir + '/' + localFilePath;

            delete options.path;

            try {
                let response = await RNFetchBlob.config({
                    path: localFilePath
                }).fetch(method, url, headers);
                // Returns an object that roughtly compatible with a standard Response object
                let output = {
                    ok: response.respInfo.status < 400,
                    path: response.data,
                    text: response.text,
                    json: response.json,
                    status: response.respInfo.status,
                    headers: response.respInfo.headers
                };

                return output;
            } catch (error) {
                throw new Error(
                    'fetchBlob: ' + method + ' ' + url + ': ' + error.toString()
                );
            }
        };

        let db = new JoplinDatabase(new DatabaseDriverReactNative());
        reg.setDb(db);

        BaseModel.dispatch = this.props.dispatch;
        NotesScreenUtils.dispatch = this.props.dispatch;
        BaseModel.db_ = db;
        navigator = this.props.navigation;

        BaseItem.loadClass('Note', Note);
        BaseItem.loadClass('Folder', Folder);
        BaseItem.loadClass('Resource', Resource);
        BaseItem.loadClass('Tag', Tag);
        BaseItem.loadClass('NoteTag', NoteTag);

        try {
            await db.open({ name: 'joplin-26.sqlite' });
            Log.info('Database is ready.');

            //await db.exec('DELETE FROM notes');
            //await db.exec('DELETE FROM folders');
            //await db.exec('DELETE FROM tags');
            //await db.exec('DELETE FROM note_tags');
            //await db.exec('DELETE FROM resources');
            //await db.exec('DELETE FROM deleted_items');

            Log.info('Loading settings...');
            await Setting.load();

            Setting.setConstant('appId', 'net.cozic.joplin-android');
            Setting.setConstant('appType', 'mobile');
            Setting.setConstant('resourceDir', RNFS.DocumentDirectoryPath);

            Log.info('Loading folders...');

            let folders = await Folder.all();

            this.props.dispatch(
                actions.folders_update_all({ folders: folders })
            );

            navigator.navigate('Folders');
        } catch {
            Log.error('Initialization error:', error);
        }
    }

    render() {
        return (
            <Stack.Navigator initialRouteName="Loading">
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
                <Stack.Screen name="Folder" component={FolderScreen} />
                <Stack.Screen name="Folders" component={FoldersScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Loading" component={LoadingScreen} />
                <Stack.Screen
                    name="OneDriveLogin"
                    component={OneDriveLoginScreen}
                />
            </Stack.Navigator>
        );
    }
}

export const HomeStack = connect(state => {
    return { nav: state.nav };
})(HomeStackComponent);

const Drawer = createDrawerNavigator();
const App = () => {
    return (
        <MenuProvider>
            <Drawer.Navigator
                drawerContent={props => <SideMenuContent {...props} />}
            >
                <Drawer.Screen name="Home" component={HomeStack} />
                <Drawer.Screen name="Folders" component={FoldersScreen} />
            </Drawer.Navigator>
        </MenuProvider>
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
