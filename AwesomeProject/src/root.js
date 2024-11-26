import React, { Component } from 'react';
import { Button, TextInput, View } from 'react-native';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';
import { ItemList } from '@/src/components/item-list';
import { NavigationContainer } from '@react-navigation/native';

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
        navigation_navigate: () => {},
        navigation_back: (state, action) => action.payload.navigation.goBack(),
        view_note: () => {}
    }
});

export const { reducer, actions } = navReducer;

const store = configureStore({
    reducer: {
        nav: reducer
    }
});

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
            </View>
        );
    }
}

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
