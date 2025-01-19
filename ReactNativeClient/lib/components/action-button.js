import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons.js';
import { FAB, Provider } from 'react-native-paper';
import { connect } from 'react-redux';
import { Log } from '@/lib/log.js';
import { _ } from '@/lib/locale.js';
import { actions } from '@/root.js';

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'dark'
    }
});

class ActionButtonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggled: false,
            open: false
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if ('toggled' in newProps) {
            this.setState({ toggled: newProps.toggled });
        }
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
            actions.navigate({ routeName: 'Folder', folderId: null })
        );
    }

    handleStateChange = ({ open }) => {
        this.setState({ open });
    };

    render() {
        const { open } = this.state;

        let buttons = this.props.buttons ? this.props.buttons : [];

        if (this.props.addFolderNoteButtons) {
            if (this.props.folders.length) {
                buttons.push({
                    title: 'New todo',
                    icon: 'checkbox-outline',
                    onPress: () => {
                        this.newTodo_press();
                    }
                });

                buttons.push({
                    title: 'New note',
                    icon: 'document',
                    onPress: () => {
                        this.newNote_press();
                    }
                });
            }

            buttons.push({
                title: 'New folder',
                icon: 'folder',
                onPress: () => {
                    this.newFolder_press();
                }
            });
        }

        let buttonComps = [];
        for (let i = 0; i < buttons.length; i++) {
            let button = buttons[i];
            let buttonTitle = button.title ? button.title : '';
            buttonComps.push({
                label: buttonTitle,
                icon: () => (
                    <Icon name={button.icon} style={styles.actionButtonIcon} />
                ),
                onPress: () => {
                    button.onPress();
                }
            });
        }

        if (!buttonComps.length && !this.props.mainButton) {
            return (
                <Provider>
                    <FAB style={{ display: 'none' }} />
                </Provider>
            );
        }

        let mainButton = this.props.mainButton ? this.props.mainButton : {};
        let mainIcon = mainButton.icon ? (
            <Icon name={mainButton.icon} style={styles.actionButtonIcon} />
        ) : (
            <Text style={{ fontSize: 20, color: '#ffffff' }}>+</Text>
        );

        let buttonElement = null;
        if (this.props.isToggle) {
            if (!this.props.buttons || this.props.buttons.length !== 2)
                throw new Error('Toggle state requires two buttons');
            let button = this.props.buttons[this.state.toggled ? 1 : 0];
            let mainIcon = button.icon;

            buttonElement = (
                <FAB
                    icon={mainIcon}
                    style={{
                        borderRadius: 10,
                        width: 56,
                        height: 56,
                        position: 'absolute',
                        right: 16,
                        bottom: 46
                    }}
                    onPress={() => {
                        let doToggle = button.onPress(this.state.toggled);
                        if (doToggle !== false)
                            this.setState({ toggled: !this.state.toggled });
                    }}
                />
            );
        } else {
            buttonElement = (
                <FAB.Group
                    visible={true}
                    open={open}
                    icon={open ? 'close' : 'plus'}
                    actions={buttonComps}
                    onStateChange={this.handleStateChange}
                />
            );
        }

        return (
            <View>
                <Provider>{buttonElement}</Provider>;
            </View>
        );
    }
}

const ActionButton = connect(state => {
    return { folders: state.nav.folders };
})(ActionButtonComponent);

export { ActionButton };
