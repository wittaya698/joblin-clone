import React, { Component } from 'react';
import { Button, TextInput, View } from 'react-native';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';
import { ItemList } from '@/src/components/item-list';

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

const reducer = createSlice({
    name: 'nav',
    initialState: defaultState,
    reducers: {
        set_button_name: (state, action) =>
            (state.nav.myButtonLabel = action.name),
        inc_counter: state => state.counter++,
        view_note: (state, action) => {
            state.selectedNoteId = action.payload.id;
            // state.counter++;
        }
    }
});

export const { set_button_name, inc_counter, view_note } = reducer.actions;

// const appReducer = {
//     reducer: {
//         nav: navReducer
//     }
// };

const store = configureStore({
    reducer: {
        nav: reducer.reducer
    }
});

class MyInput extends Component {
    render() {
        return (
            <TextInput
                value={this.props.text}
                onChangeText={this.props.onChangeText}
            />
        );
    }
}

const mapStateToInputProps = function (state) {
    return { text: state.nav.defaultText };
};

const mapDispatchToInputProps = function (dispatch) {
    return {
        onChangeText(text) {
            dispatch(
                set_button_name({
                    name: text
                })
            );
        }
    };
};

const MyConnectionInput = connect(
    mapStateToInputProps,
    mapDispatchToInputProps
)(MyInput);

class NotesScreen extends React.Component {
    static navigationOptions = {
        title: 'Notes'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <ItemList style={{ flex: 1 }} />
                <Button title="Create note" onPress={() => navigate('Note')} />
                <MyConnectionInput />
            </View>
        );
    }
}

class NoteScreen extends React.Component {
    static navigationOptions = {
        title: 'Note'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <TextInput
                    style={{ flex: 1, textAlignVertical: 'top' }}
                    multiline={true}
                />
                <Button title="Save note" onPress={() => navigate('Notes')} />;
                <MyConnectionInput />
            </View>
        );
    }
}

class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Profile'
    };
    render() {
        const { navigate } = this.props.navigation;
        return <Button title="Go to main" onPress={() => navigate('Notes')} />;
    }
}

const Stack = createStackNavigator();
class AppNavigator extends React.Component {
    render() {
        return (
            <Stack.Navigator>
                <Stack.Screen name="Notes" component={NotesScreen} />
                <Stack.Screen name="Note" component={NoteScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
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

// class AppComponent extends React.Component {
//     render() {
//         return (
//             // <NavigationContainer>
//             <Stack.Navigator>
//                 <Stack.Screen name="Main" component={MainScreen} />
//                 <Stack.Screen name="Profile" component={ProfileScreen} />
//             </Stack.Navigator>
//             // </NavigationContainer>
//         );
//     }
// }

// const navInitialState = null;

// const navReducer = createSlice({
//     name: 'nav',
//     initialState: navInitialState,
//     reducers: {
//         setNavState: (state, action) => action.payload
//     }
// }).reducer;

// const appReducer = {
//     reducer: {
//         nav: navReducer
//     }
// };

// const mapStateToProps = state => ({
//     nav: state.nav
// });

// const App = connect(mapStateToProps)(AppComponent);

// const store = configureStore(appReducer);

// class Root extends React.Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <App />
//             </Provider>
//         );
//     }
// }

export { Root };
