import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons.js';
import { FAB, Provider } from 'react-native-paper';
import { connect } from 'react-redux';

import { actions } from '@/root.js';

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white'
    }
});

class ActionButtonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    newTodo_press() {
        this.props.dispatch(
            actions.navigate({
                routeName: 'Note',
                noteId: null,
                folderId: this.props.parentFolderId,
                itemType: 'todo'
            })
        );
        // this.props.dispatch({
        // 	type: 'Navigation/NAVIGATE',
        // 	routeName: 'Note',
        // 	noteId: null,
        // 	folderId: this.props.parentFolderId,
        // 	itemType: 'todo',
        // });
    }

    newNote_press() {
        this.props.dispatch(
            actions.navigate({
                routeName: 'Note',
                noteId: null,
                folderId: this.props.parentFolderId
            })
        );
    }

    newFolder_press() {
        this.props.dispatch(
            actions.navigate({ routeName: 'Folder', noteId: null })
        );
    }

    handleStateChange = ({ open }) => {
        this.setState({ open });
    };

    render() {
        const { open } = this.state;
        const style = styles.actionButtonIcon;
        const actions = [
            {
                label: 'New todo',
                icon: () => <Icon name="checkbox-outline" style={style} />,
                onPress: () => {
                    this.newTodo_press();
                }
            },
            {
                label: 'New note',
                icon: () => <Icon name="document" style={style} />,
                onPress: () => {
                    this.newNote_press();
                }
            },
            {
                label: 'New folder',
                icon: () => <Icon name="folder" style={style} />,
                onPress: () => {
                    this.newFolder_press();
                }
            }
        ];
        return (
            <Provider>
                {/* <Portal> */}
                <FAB.Group
                    visible={true}
                    open={open}
                    icon={open ? 'close' : 'plus'}
                    actions={actions}
                    onStateChange={this.handleStateChange}
                />
                {/* </Portal> */}
            </Provider>
        );
    }
}

const ActionButton = connect(state => {
    return {};
})(ActionButtonComponent);

export { ActionButton };
