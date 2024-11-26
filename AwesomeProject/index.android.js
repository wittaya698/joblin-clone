import React, { Component } from 'react';
import { AppRegistry, Button, TextInput, View } from 'react-native';

import { configureStore, createSlice } from '@reduxjs/toolkit';
import { connect, Provider, useSelector } from 'react-redux';

import { Database } from './src/database';
import { WebApi } from './src/web-api';

import { SessionService } from './src/services/session-service.js';

import { Log } from './src/log.js';

import { LoginButton } from './src/components/login-button.js';

import { Root } from '@/src/root.js';

export default class AndroidHome extends Component {
    render() {
        return <Root />;
    }
}
// let debugMode = true;
// let clientId = 'A7D301DA7D301DA7D301DA7D301DA7D3';

// let db = new Database();
// db.setDebugEnabled(debugMode);
// db.open();

// let defaultState = {
//     myButtonLabel: 'click',
//     counter: 0
// };

// const counterSlice = createSlice({
//     name: 'counter',
//     initialState: defaultState,
//     reducers: {
//         set_button_name: (state, action) => {
//             state.myButtonLabel = action.payload.name;
//         },
//         inc_counter: state => {
//             state.counter++;
//         }
//     }
// });

// export const { set_button_name, inc_counter } = counterSlice.actions;

// let store = configureStore({
//     reducer: {
//         counter: counterSlice.reducer
//     }
// });

// class MyInput extends Component {
//     render() {
//         return <TextInput onChangeText={this.props.onChangeText} />;
//     }
// }

// const mapStateToInputProps = function (state) {
//     return {};
// };

// const mapDispatchToInputProps = function (dispatch) {
//     return {
//         onChangeText(text) {
//             dispatch(set_button_name({ name: text }));
//         }
//     };
// };

// const MyConnectionInput = connect(
//     mapStateToInputProps,
//     mapDispatchToInputProps
// )(MyInput);

// export default class AndroidHome extends Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <View>
//                     <MyConnectionInput />
//                     <LoginButton />
//                 </View>
//             </Provider>
//         );
//     }
// }

// let api = new WebApi('http://192.168.2.42:8000');
// let sessionService = new SessionService(api);
// sessionService
//     .login('wittayathongjeen698@gmail.com', '0906198331', clientId)
//     .then(session => {
//         console.info('GOT DATA:');
//         console.info(session);
//     })
//     .catch(function (error) {
//         console.warn('GOT ERROR:');
//         console.warn(error);
//     });

// import { createStackNavigator } from '@react-navigation/stack';

// const Stack = createStackNavigator();

// class MainScreen extends React.Component {
//     static navigationOptions = {
//         title: 'Welcome'
//     };
//     render() {
//         const { navigate } = this.props.navigation;
//         return (
//             <Button
//                 title="Go to Jane's profile"
//                 onPress={() => navigate('Profile', { name: 'Jane' })}
//             />
//         );
//     }
// }

// class ProfileScreen extends React.Component {
//     static navigationOptions = {
//         title: 'Profile'
//     };
//     render() {
//         const { navigate } = this.props.navigation;
//         return <Button title="Go to main" onPress={() => navigate('Main')} />;
//     }
// }

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

// export default class Root extends React.Component {
//     render() {
//         return (
//             <Provider store={store}>
//                 <App />
//             </Provider>
//         );
//     }
// }
