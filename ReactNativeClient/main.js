// Note about the application structure:
// - The user interface and its state is managed by React/Redux.
// - Persistent storage to SQLite and Web API is handled outside of React/Redux using regular JavaScript (no middleware, no thunk, etc.).
// - Communication from React to SQLite is done by calling model methods (note.save, etc.)
// - Communication from SQLite to Redux is done via dispatcher.

// So there's basically still a one way flux: React => SQLite => Redux => React

import { Root } from '@/root.js';
import React, { Component } from 'react';
import { Registry } from '@/lib/registry';
import { Log } from '@/lib/log';

export default class Main extends Component {
    render() {
        Registry.setDebugMode(true);
        Log.setLevel(Registry.debugMode() ? Log.LEVEL_DEBUG : Log.LEVEL_WARN);
        console.ignoredYellowBox = ['Remote debugger'];
        Log.info(
            'START ======================================================================================================'
        );
        // Note: The final part of the initialization process is in
        // AppComponent.componentDidMount(), when the application is ready.
        return <Root />;
    }
}

export { Main };
