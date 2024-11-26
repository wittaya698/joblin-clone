import React, { Component } from 'react';
import { Main } from '@/src/main.js';

export default class AndroidHome extends Component {
    render() {
        return <Main />;
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
