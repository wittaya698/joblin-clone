import { Root } from '@/src/root.js';
import React, { Component } from 'react';
import { Database } from '@/src/database';
import { BaseModel } from '@/src/base-model';

export default class Main extends Component {
    render() {
        let debugMode = true;
        let clientId = 'A7D301DA7D301DA7D301DA7D301DA7D3';

        let db = new Database();
        db.setDebugEnabled(debugMode);
        db.open();

        BaseModel.setDb(db);

        return <Root />;
    }
}

export { Main };
