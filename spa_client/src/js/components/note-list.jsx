import React from "react";
import { connect } from "react-redux";
import * as fi from "models/folder-item.jsx";
import NoteListItem from "./note-list-item.jsx";

class NoteListComponent extends React.Component {
  render() {
    let elements = [];

    this.props.items.forEach((item, index) => {
      let selected = this.props.selectedNoteId == item.id;
      elements.push(
        <NoteListItem
          selected={selected}
          key={item.id}
          title={item.title}
          body={item.body}
          id={item.id}
        />
      );
    });
    return <div className="note-list">{elements}</div>;
  }
}

const mapStateToProps = function (state) {
  return {
    items: fi.notes(state.items.items, state.items.selectedFolderId),
    selectedNoteId: state.items.selectedNoteId,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {};
};

const NoteList = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteListComponent);

export default NoteList;
