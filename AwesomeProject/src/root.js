import React from 'react';
import { Button } from 'react-native';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider } from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

class MainScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <Button
                title="Go to Jane's profile"
                onPress={() => navigate('Profile', { name: 'Jane' })}
            />
        );
    }
}

class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: 'Profile'
    };
    render() {
        const { navigate } = this.props.navigation;
        return <Button title="Go to main" onPress={() => navigate('Main')} />;
    }
}

class AppComponent extends React.Component {
    render() {
        return (
            // <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
            // </NavigationContainer>
        );
    }
}

const navInitialState = null;

const navReducer = createSlice({
    name: 'nav',
    initialState: navInitialState,
    reducers: {
        setNavState: (state, action) => action.payload
    }
}).reducer;

const appReducer = {
    reducer: {
        nav: navReducer
    }
};

const mapStateToProps = state => ({
    nav: state.nav
});

const App = connect(mapStateToProps)(AppComponent);

const store = configureStore(appReducer);

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
