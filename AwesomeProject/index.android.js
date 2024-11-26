import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Component } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { connect, Provider } from 'react-redux';
import { Database } from './src/database';
import { WebApi } from './src/web-api';
//import { Session } from 'src/model/session.js';

import { SessionService } from './src/service/session-service.js';

let debugMode = true;
let clientId = 'A7D301DA7D301DA7D301DA7D301DA7D3';

let db = new Database();
db.setDebugEnabled(debugMode);
db.open();

let defaultState = {
    myButtonLabel: 'clicko123456',
    counter: 0
};

const counterSlice = createSlice({
    name: 'counter',
    initialState: defaultState,
    reducers: {
        set_button_name: (state, action) => {
            state.myButtonLabel = action.payload.name;
            console.log(state.myButtonLabel);
        },
        inc_counter: state => {
            state.counter++;
        }
    }
});

const { set_button_name, inc_counter } = counterSlice.actions;

let store = configureStore({
    reducer: {
        counter: counterSlice.reducer
    }
});

class MyButton extends Component {
    render() {
        var label = this.props.label;
        if (label === undefined) label = '';
        return <Button onPress={this.props.onPress} title={label} />;
    }
}

class MyInput extends Component {
    render() {
        return <TextInput onChangeText={this.props.onChangeText} />;
    }
}

const mapStateToButtonProps = function (state) {
    return { label: state.counter.myButtonLabel };
};

const mapDispatchToButtonProps = function (dispatch) {
    return {
        onPress: function () {
            dispatch(inc_counter());
        }
    };
};

const MyConnectedButton = connect(
    mapStateToButtonProps,
    mapDispatchToButtonProps
)(MyButton);

const mapStateToInputProps = function (state) {
    return {};
};

const mapDispatchToInputProps = function (dispatch) {
    return {
        onChangeText(text) {
            dispatch(set_button_name({ name: text }));
        }
    };
};

const MyConnectionInput = connect(
    mapStateToInputProps,
    mapDispatchToInputProps
)(MyInput);

export default class AndroidHome extends Component {
    render() {
        return (
            <Provider store={store}>
                <View>
                    <MyConnectedButton />
                    <MyConnectionInput />
                </View>
            </Provider>
        );
    }
}

let api = new WebApi('http://192.168.2.42:8000');
let sessionService = new SessionService(api);
sessionService
    .login('wittayathongjeen698@gmail.com', '0906198331', clientId)
    .then(session => {
        console.info('GOT DATA:');
        console.info(session);
    })
    .catch(function (error) {
        console.warn('GOT ERROR:');
        console.warn(error);
    });
