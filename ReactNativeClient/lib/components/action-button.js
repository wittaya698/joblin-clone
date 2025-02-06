const React = require('react');
const { StyleSheet, Text, View } = require('react-native');
const Icon = require('react-native-vector-icons/Ionicons').default;
const { FAB, Provider } = require('react-native-paper');
const { connect } = require('react-redux');
const { globalStyle } = require('lib/components/global-style.js');
const { Log } = require('lib/log.js');
const { _ } = require('lib/locale.js');

const styles = StyleSheet.create({
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'dark'
    },
    itemText: {
        // fontSize: 14, // Cannot currently set fontsize since the bow surrounding the label has a fixed size
    }
});

class ActionButtonComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonIndex: 0,
            open: false
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if ('buttonIndex' in newProps) {
            this.setState({ buttonIndex: newProps.buttonIndex });
        }
    }

    newTodo_press() {
        this.props.dispatch({
            type: 'NAV_GO',
            routeName: 'Note',
            noteId: null,
            folderId: this.props.parentFolderId,
            itemType: 'todo'
        });
    }

    newNote_press() {
        this.props.dispatch({
            type: 'NAV_GO',
            routeName: 'Note',
            noteId: null,
            folderId: this.props.parentFolderId,
            itemType: 'note'
        });
    }

    newFolder_press() {
        this.props.dispatch({
            type: 'NAV_GO',
            routeName: 'Folder',
            folderId: null
        });
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
                    title: 'New to-do',
                    icon: 'checkbox',
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
                title: 'New notebook',
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
            <Icon name="add" style={styles.actionButtonIcon} />
        );

        let buttonElement = null;
        if (this.props.multiStates) {
            if (!this.props.buttons || !this.props.buttons.length)
                throw new Error(
                    'Multi-state button requires at least one state'
                );
            if (
                this.state.buttonIndex < 0 ||
                this.state.buttonIndex >= this.props.buttons.length
            )
                throw new Error(
                    'Button index out of bounds: ' +
                        this.state.buttonIndex +
                        '/' +
                        this.props.buttons.length
                );
            let button = this.props.buttons[this.state.buttonIndex];
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
                        button.onPress();
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

        return <Provider>{buttonElement}</Provider>;
    }
}

const ActionButton = connect(state => {
    return { folders: state.folders };
})(ActionButtonComponent);

module.exports = { ActionButton };
