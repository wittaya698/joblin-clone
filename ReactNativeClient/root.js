import React, { Component } from 'react';
import { BackHandler, Keyboard } from 'react-native';
import { connect, Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { shimInit } from '@/lib/shim-init-react.js';
import { Log } from '@/lib/log.js';
import { AppNav } from '@/lib/components/app-nav.js';
import { Logger } from '@/lib/logger.js';
import { Note } from '@/lib/models/note.js';
import { Folder } from '@/lib/models/folder.js';
import { FoldersScreenUtils } from '@/lib/components/screens/folders-utils.js';
import { Resource } from '@/lib/models/resource.js';
import { Tag } from '@/lib/models/tag.js';
import { NoteTag } from '@/lib/models/note-tag.js';
import { BaseItem } from '@/lib/models/base-item.js';
import { BaseModel } from '@/lib/base-model.js';
import { JoplinDatabase } from '@/lib/joplin-database.js';
import { Database } from '@/lib/database.js';
import { ItemList } from '@/lib/components/item-list.js';
import { NotesScreen } from '@/lib/components/screens/notes.js';
import { NotesScreenUtils } from '@/lib/components/screens/notes-utils.js';
import { NoteScreen } from '@/lib/components/screens/note.js';
import { FolderScreen } from '@/lib/components/screens/folder.js';
import { FoldersScreen } from '@/lib/components/screens/folders.js';
import { LogScreen } from '@/lib/components/screens/log.js';
import { StatusScreen } from '@/lib/components/screens/status.js';
import { WelcomeScreen } from '@/lib/components/screens/welcome.js';
import { OneDriveLoginScreen } from '@/lib/components/screens/onedrive-login.js';
import { Setting } from '@/lib/models/setting.js';
import { MenuProvider } from 'react-native-popup-menu';
import { SideMenuContent } from '@/lib/components/side-menu-content.js';
import { DatabaseDriverReactNative } from '@/lib/database-driver-react-native.js';
import { reg } from '@/lib/registry.js';
import RNFS, { stat } from 'react-native-fs';

let defaultState = {
    notes: [],
    folders: [],
    selectedNoteId: null,
    selectedItemType: 'note',
    selectedFolderId: null,
    showSideMenu: false,
    screens: {},
    loading: true,
    historyCanGoBack: false,
    notesOrder: {
        orderBy: 'updated_time',
        orderByDir: 'DESC'
    }
};

const initialRoute = {
    routeName: 'Welcome',
    payload: {}
};

defaultState.route = initialRoute;

let navHistory = [];
navHistory.push(initialRoute);

function historyCanGoBackTo(route) {
    if (route.routeName == 'Note' && !route.payload.noteId) return false;
    if (route.routeName == 'Folder' && !route.payload.folderId) return false;
    return true;
}

const navReducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        navigate: (state, action) => {
            const currentRoute = state.route;
            const currentRouteName = currentRoute ? currentRoute.routeName : '';

            newRoute = {};
            if (action.payload.routeName === 'Back') {
                if (!state.historyCanGoBack) return;
                action = navHistory.pop(); // Current page
                action = navHistory.pop(); // Previous page

                while (!historyCanGoBackTo(action)) {
                    if (!navHistory.length) {
                        action = null;
                        break;
                    }
                    action = navHistory.pop();
                }

                if (!action) action = Object.assign({}, initialRoute);
            } else {
                if (state.route == action) {
                    // If the current screen is already the requested screen, don't do anything
                } else {
                    if (action.payload.routeName == 'Welcome') navHistory = [];
                    action = {
                        routeName: action.payload.routeName,
                        payload: action.payload
                    };
                }
            }

            reg.logger().info(
                'Route: ' + currentRouteName + ' => ' + action.payload.routeName
            );

            if ('noteId' in action.payload) {
                state.selectedNoteId = action.payload.noteId;
            }

            if ('folderId' in action.payload) {
                state.selectedFolderId = action.payload.folderId;
            }

            if ('itemType' in action.payload) {
                state.selectedItemType = action.payload.itemType;
            }

            state.route = action;
            navHistory.push(action);
            state.historyCanGoBack = navHistory.length > 2;

            if (state.route.routeName == 'Notes') {
                Setting.setValue('activeFolderId', state.selectedFolderId);
            }

            Keyboard.dismiss(); // TODO: should probably be in some middleware
        },

        // Replace all the notes with the provided array
        application_loading_done: (state, action) => {
            state.loading = false;
        },

        // Replace all the notes with the provided array
        notes_update_all: (state, action) => {
            state.notes = action.payload.notes;
        },
        // Insert the note into the note list if it's new, or
        // update it if it already exists.
        notes_update_one: (state, action) => {
            if (action.payload.note.parent_id != state.selectedFolderId) return;

            let newNotes = state.notes.splice(0);
            var found = false;
            for (let i = 0; i < newNotes.length; i++) {
                let n = newNotes[i];
                if (n.id == action.payload.note.id) {
                    newNotes[i] = Object.assign(
                        newNotes[i],
                        action.payload.note
                    );
                    found = true;
                    break;
                }
            }

            if (!found) newNotes.push(action.payload.note);

            newNotes = Note.sortNotes(newNotes, state.notesOrder);
            state.notes = newNotes;
        },

        notes_delete: (state, action) => {
            var newNotes = [];
            for (let i = 0; i < state.notes.length; i++) {
                let f = state.notes[i];
                if (f.id == action.payload.noteId) continue;
                newNotes.push(f);
            }

            newState = Object.assign({}, state);
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
                    newFolders[i] = Object.assign(
                        newFolders[i],
                        action.payload.folder
                    );
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

let initializationState_ = 'waiting';

async function initialize(dispatch, backButtonHandler) {
    if (initializationState_ != 'waiting') return;

    shimInit();
    initializationState_ = 'in_progress';

    Setting.setConstant('env', __DEV__ ? 'dev' : 'prod');
    Setting.setConstant('appId', 'net.witthaya.joplin_clone');
    Setting.setConstant('appType', 'mobile');
    Setting.setConstant('resourceDir', RNFS.DocumentDirectoryPath);

    const logDatabase = new Database(new DatabaseDriverReactNative());
    await logDatabase.open({ name: 'log.sqlite' });
    await logDatabase.exec(Logger.databaseCreateTableSql());

    const mainLogger = new Logger();
    mainLogger.addTarget('database', { database: logDatabase, source: 'm' });
    if (Setting.value('env') == 'dev') mainLogger.addTarget('console');
    mainLogger.setLevel(Logger.LEVEL_DEBUG);

    reg.setLogger(mainLogger);

    reg.logger().info('====================================');
    reg.logger().info(
        'Starting application ' +
            Setting.value('appId') +
            ' (' +
            Setting.value('env') +
            ')'
    );

    const dbLogger = new Logger();
    dbLogger.addTarget('database', { database: logDatabase, source: 'm' });
    if (Setting.value('env') == 'dev') dbLogger.addTarget('console');
    if (Setting.value('env') == 'dev') {
        dbLogger.setLevel(Logger.LEVEL_INFO); // Set to LEVEL_DEBUG for full SQL queries
    } else {
        dbLogger.setLevel(Logger.LEVEL_INFO);
    }

    let db = new JoplinDatabase(new DatabaseDriverReactNative());
    db.setLogger(dbLogger);
    reg.setDb(db);

    BaseModel.dispatch = dispatch;
    NotesScreenUtils.dispatch = dispatch;
    NotesScreenUtils.store = store;
    FoldersScreenUtils.dispatch = dispatch;
    BaseModel.db_ = db;

    BaseItem.loadClass('Note', Note);
    BaseItem.loadClass('Folder', Folder);
    BaseItem.loadClass('Resource', Resource);
    BaseItem.loadClass('Tag', Tag);
    BaseItem.loadClass('NoteTag', NoteTag);

    try {
        if (Setting.value('env') == 'prod') {
            await db.open({ name: 'joplin.sqlite' });
        } else {
            await db.open({ name: 'joplin-27.sqlite' });

            // await db.exec('DELETE FROM notes');
            // await db.exec('DELETE FROM folders');
            // await db.exec('DELETE FROM tags');
            // await db.exec('DELETE FROM note_tags');
            // await db.exec('DELETE FROM resources');
            // await db.exec('DELETE FROM deleted_items');

            // await db.exec('UPDATE notes SET is_conflict = 1 where id like "546f%"');
        }

        reg.logger().info('Database is ready.');
        reg.logger().info('Loading settings...');
        await Setting.load();

        reg.logger().info('Loading folders...');

        await FoldersScreenUtils.refreshFolders();
        dispatch(actions.application_loading_done());

        let folderId = Setting.value('activeFolderId');
        let folder = await Folder.load(folderId);

        if (folder) {
            await NotesScreenUtils.openNoteList(folderId);
        } else {
            await NotesScreenUtils.openDefaultNoteList();
        }
    } catch {
        reg.logger().error('Initialization error:', error);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
        return backButtonHandler();
    });

    initializationState_ = 'done';
    reg.logger().info('Application initialized');
}

class HomeStackComponent extends React.Component {
    async componentDidMount() {
        await initialize(
            this.props.dispatch,
            this.backButtonHandler.bind(this)
        );
    }

    backButtonHandler() {
        if (this.props.showSideMenu) {
            this.props.dispatch(actions.side_menu_close());
            return true;
        }

        if (this.props.historyCanGoBack) {
            this.props.dispatch(actions.navigate({ routeName: 'Back' }));
            return true;
        }

        return false;
    }

    render() {
        const appNavInit = {
            Welcome: { screen: WelcomeScreen },
            Notes: { screen: NotesScreen },
            Note: { screen: NoteScreen },
            Folder: { screen: FolderScreen },
            OneDriveLogin: { screen: OneDriveLoginScreen },
            Log: { screen: LogScreen },
            Status: { screen: StatusScreen }
        };

        return <AppNav screens={appNavInit} />;
    }
}

export const HomeStack = connect(state => {
    return {
        historyCanGoBack: state.nav.historyCanGoBack,
        showSideMenu: state.nav.showSideMenu
    };
})(HomeStackComponent);

const Drawer = createDrawerNavigator();
const App = () => {
    return (
        <MenuProvider>
            <Drawer.Navigator
                drawerContent={props => <SideMenuContent {...props} />}
            >
                <Drawer.Screen name="Home" component={HomeStack} />
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
