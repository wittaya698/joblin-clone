import { Root } from '@/src/root.js';
import React, { Component } from 'react';
import { Database } from '@/src/database';
import { BaseModel } from '@/src/base-model';
import { Registry } from './registry';
import { AppRegistry } from 'react-native';

export default class Main extends Component {
    render() {
        Registry.setDebugMode(true);
        // Note: The final part of the initialization process is in
        // AppComponent.componentDidMount(), when the application is ready.
        return <Root />;
    }
}

export { Main };
