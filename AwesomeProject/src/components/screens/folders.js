import React from 'react';
import { Button, View } from 'react-native';
import { connect } from 'react-redux';

import { FolderList } from '@/src/components/folder-list';
import { ScreenHeader } from '@/src/components/screen-header';
import { actions } from '@/src/root';
import { ActionButton } from '@/src/components/action-button';

class FoldersScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    render() {
        nav = this.props.navigation;
        this.props.dispatch(actions.set_navigator({ navigator: nav }));
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
                <FolderList style={{ flex: 1 }} />
                <ActionButton></ActionButton>
            </View>
        );
    }
}

const FoldersScreen = connect(state => {
    return {
        folders: state.nav.folders,
        navigator: state.nav.navigator
    };
})(FoldersScreenComponent);

export { FoldersScreen };
