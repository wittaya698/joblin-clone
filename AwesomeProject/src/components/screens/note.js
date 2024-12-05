import React from 'react';
import { View, Button, TextInput } from 'react-native';
import { connect } from 'react-redux';

import { Log } from '@/src/log.js';
import { actions } from '@/src/root';
import { Note } from '@/src/models/note.js';
import { ScreenHeader } from '@/src/components/screen-header';

class NoteScreenComponent extends React.Component {
    static navigationOptions = options => {
        return { header: null };
    };

    constructor() {
        super();
        this.state = { note: Note.new() };
    }

    UNSAFE_componentWillMount() {
        this.setState({ note: this.props.note });
    }

    noteComponent_change = (propName, propValue) => {
        this.setState((prevState, props) => {
            let note = Object.assign({}, prevState.note);
            note[propName] = propValue;
            return { note: note };
        });
    };

    title_changeText = text => {
        this.noteComponent_change('title', text);
    };

    body_changeText = text => {
        this.noteComponent_change('body', text);
    };

    saveNoteButton_press = () => {
        Note.save(this.state.note)
            .then(note => {
                this.props.dispatch(actions.notes_update_one({ note: note }));
            })
            .catch(error => {
                Log.warn('Cannot save note', error);
            });
    };
    render() {
        routeName = nav.getState().routes[nav.getState().index].name;
        return (
            <View style={{ flex: 1 }}>
                <ScreenHeader navState={{ routeName: routeName }} />
                <TextInput
                    value={this.state.note.title}
                    onChangeText={this.title_changeText}
                />
                <TextInput
                    style={{ flex: 1, textAlignVertical: 'top' }}
                    multiline={true}
                    value={this.state.note.body}
                    onChangeText={this.body_changeText}
                />
                <Button title="Save note" onPress={this.saveNoteButton_press} />
            </View>
        );
    }
}

const NoteScreen = connect(state => {
    return {
        note: state.nav.selectedNoteId
            ? Note.byId(state.nav.notes, state.nav.selectedNoteId)
            : Note.new(state.nav.selectedFolderId)
    };
})(NoteScreenComponent);

export { NoteScreen };
