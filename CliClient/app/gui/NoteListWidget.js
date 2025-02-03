const Note = require('@/lib/models/note.js').Note;
const ListWidget = require('tkwidgets/ListWidget.js');

class NoteListWidget extends ListWidget {
    constructor() {
        super();
        this.selectedNoteId_ = 0;
    }

    get selectedNoteId() {
        throw new Error(
            'NoteListWidget get selectedNoteId() need to be implemented'
        );
    }

    set selectedNoteId(v) {
        throw new Error(
            'NoteListWidget set selectedNoteId() need to be implemented'
        );
    }

    render() {
        throw new Error('NoteListWidget render() need to be implemented');
    }
}

module.exports = NoteListWidget;
