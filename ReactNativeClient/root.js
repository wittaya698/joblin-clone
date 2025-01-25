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
import { NotesScreen } from '@/lib/components/screens/notes.js';
import { NoteScreen } from '@/lib/components/screens/note.js';
import { FolderScreen } from '@/lib/components/screens/folder.js';
import { ConfigScreen } from '@/lib/components/screens/config.js';
import { LogScreen } from '@/lib/components/screens/log.js';
import { StatusScreen } from '@/lib/components/screens/status.js';
import { WelcomeScreen } from '@/lib/components/screens/welcome.js';
import { SearchScreen } from '@/lib/components/screens/search.js';
import { OneDriveLoginScreen } from '@/lib/components/screens/onedrive-login.js';
import { Setting } from '@/lib/models/setting.js';
import { MenuProvider } from 'react-native-popup-menu';
import { SideMenuContent } from '@/lib/components/side-menu-content.js';
import { DatabaseDriverReactNative } from '@/lib/database-driver-react-native.js';
import { reg } from '@/lib/registry.js';
import { _, setLocale } from '@/lib/locale.js';
import RNFS, { stat } from 'react-native-fs';
import { PoorManIntervals } from '@/lib/poor-man-intervals.js';

let defaultState = {
    notes: [],
    notesSource: '',
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
    },
    syncStarted: false,
    syncReport: {},
    searchQuery: ''
};

const initialRoute = {
    routeName: 'Welcome',
    payload: {}
};

defaultState.route = initialRoute;

let navHistory = [];

function historyCanGoBackTo(route) {
    if (route.routeName == 'Note') return false;
    if (route.routeName == 'Folder') return false;

    return true;
}

function reducerActionsAreSame(a1, a2) {
    if (
        Object.getOwnPropertyNames(a1).length !==
        Object.getOwnPropertyNames(a2).length
    )
        return false;
    for (let n in a1) {
        if (!a1.hasOwnProperty(n)) continue;
        if (a1[n] !== a2[n]) return false;
    }
    return true;
}

const navReducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        navigate: (state, action) => {
            const currentRoute = state.route;
            const currentRouteName = currentRoute ? currentRoute.routeName : '';

            action = {
                routeName: action.payload.routeName,
                payload: action.payload
            };

            let historyGoingBack = false;

            if (action.payload.routeName === 'Back') {
                if (!navHistory.length) return;

                let newAction = null;
                while (navHistory.length) {
                    newAction = navHistory.pop();
                    if (newAction.routeName != state.route.routeName) break;
                }

                action = newAction ? newAction : navHistory.pop();
                historyGoingBack = true;
            }

            if (!historyGoingBack && historyCanGoBackTo(currentRoute)) {
                // If the route *name* is the same (even if the other parameters are different), we
                // overwrite the last route in the history with the current one. If the route name
                // is different, we push a new history entry.
                if (currentRoute.routeName == action.payload.routeName) {
                    // nothing
                } else {
                    if (action.payload.routeName == 'Welcome') navHistory = [];
                    navHistory.push({
                        routeName: currentRoute.routeName,
                        payload: Object.assign({}, currentRoute.payload)
                    });
                }
            }

            // HACK: whenever a new screen is loaded, all the previous screens of that type
            // are overwritten with the new screen parameters. This is because the way notes
            // are currently loaded is not optimal (doesn't retain history properly) so
            // this is a simple fix without doing a big refactoring to change the way notes
            // are loaded. Might be good enough since going back to different folders
            // is probably not a common workflow.
            for (let i = 0; i < navHistory.length; i++) {
                let n = navHistory[i];
                if (n.routeName == action.routeName) {
                    navHistory[i] = Object.assign({}, action);
                }
            }

            if (action.payload.routeName == 'Welcome') navHistory = [];

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

            state.historyCanGoBack = !!navHistory.length;

            if (state.route.routeName == 'Notes') {
                Setting.setValue('activeFolderId', state.selectedFolderId);
            }

            Keyboard.dismiss(); // TODO: should probably be in some middleware
        },

        // Replace all the notes with the provided array
        application_loading_done: (state, action) => {
            state.loading = false;
            PoorManIntervals.update();
        },

        // Replace all the notes with the provided array
        notes_update_all: (state, action) => {
            state.notes = action.payload.notes;
            state.notesSource = action.payload.notesSource;
            PoorManIntervals.update();
        },

        // Insert the note into the note list if it's new, or
        // update it if it already exists.
        notes_update_one: (state, action) => {
            const modNote = action.payload.note;

            let newNotes = state.notes.splice(0);
            var found = false;
            for (let i = 0; i < newNotes.length; i++) {
                let n = newNotes[i];
                if (n.id == modNote.id) {
                    if (
                        !('parent_id' in modNote) ||
                        modNote.parent_id == n.parent_id
                    ) {
                        // Merge the properties that have changed (in modNote) into
                        // the object we already have.
                        newNotes[i] = Object.assign(
                            newNotes[i],
                            action.payload.note
                        );
                    } else {
                        newNotes.splice(i, 1);
                    }
                    found = true;
                    break;
                }
            }

            if (
                !found &&
                'parent_id' in modNote &&
                modNote.parent_id == state.selectedFolderId
            )
                newNotes.push(modeNote);

            newNotes = Note.sortNotes(newNotes, state.notesOrder);
            state.notes = newNotes;
            PoorManIntervals.update();
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
            PoorManIntervals.update();
        },

        folders_update_all: (state, action) => {
            state.folders = action.payload.folders;
            PoorManIntervals.update();
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
            PoorManIntervals.update();
        },

        folder_delete: (state, action) => {
            var newFolders = [];
            for (let i = 0; i < state.folders.length; i++) {
                let f = state.folders[i];
                if (f.id == action.payload.folderId) continue;
                newFolders.push(f);
            }

            state.folders = newFolders;
            PoorManIntervals.update();
        },

        side_menu_toggle: (state, action) => {
            state.showSideMenu = !state.showSideMenu;
        },

        side_menu_open: (state, action) => {
            state.showSideMenu = true;
        },

        side_menu_close: (state, action) => {
            state.showSideMenu = false;
        },

        sync_started: (state, action) => {
            state.syncStarted = true;
        },

        sync_completed: (state, action) => {
            state.syncStarted = false;
        },

        sync_report_update: (state, action) => {
            state.syncReport = action.payload.report;
        },

        search_query: (state, action) => {
            state.searchQuery = action.payload.query.trim();
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
    if (Setting.value('env') == 'dev') {
        dbLogger.addTarget('console');
        dbLogger.setLevel(Logger.LEVEL_INFO); // Set to LEVEL_DEBUG for full SQL queries
    } else {
        dbLogger.setLevel(Logger.LEVEL_INFO);
    }

    let db = new JoplinDatabase(new DatabaseDriverReactNative());
    db.setLogger(dbLogger);
    reg.setDb(db);

    reg.dispatch = dispatch;
    BaseModel.dispatch = dispatch;
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
            await db.open({ name: 'joplin-28.sqlite' });

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

        setLocale(Setting.value('locale'));

        reg.logger().info('Loading folders...');

        await FoldersScreenUtils.refreshFolders();
        dispatch(actions.application_loading_done());

        let folderId = Setting.value('activeFolderId');
        let folder = await Folder.load(folderId);

        if (!folder) folder = await Folder.defaultFolder();
        if (!folder) {
            dispatch(actions.navigate({ routeName: 'Welcome' }));
        } else {
            dispatch(
                actions.navigate({ routeName: 'Notes', folderId: folder.id })
            );
        }
    } catch (error) {
        reg.logger().error('Initialization error:', error);
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
        return backButtonHandler();
    });

    PoorManIntervals.setInterval(() => {
        reg.logger().info('Running background sync on timer...');
        reg.scheduleSync(0);
    }, 1000 * 60 * 5);

    if (Setting.value('env') == 'dev') {
    } else {
        reg.scheduleSync();
    }

    initializationState_ = 'done';
    reg.logger().info('Application initialized');
}

class HomeStackComponent extends React.Component {
    constructor() {
        super();
        this.lastSyncStarted_ = defaultState.syncStarted;
    }

    async componentDidMount() {
        await initialize(
            this.props.dispatch,
            this.backButtonHandler.bind(this)
        );
    }

    componentWillReceiveProps(newProps) {
        if (newProps.syncStarted != this.lastSyncStarted_) {
            if (!newProps.syncStarted) FoldersScreenUtils.refreshFolders();
            this.lastSyncStarted_ = newProps.syncStarted;
        }
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
            Status: { screen: StatusScreen },
            Search: { screen: SearchScreen },
            Config: { screen: ConfigScreen }
        };

        return <AppNav screens={appNavInit} />;
    }
}

export const HomeStack = connect(state => {
    return {
        historyCanGoBack: state.nav.historyCanGoBack,
        showSideMenu: state.nav.showSideMenu,
        syncStarted: state.syncStarted
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
