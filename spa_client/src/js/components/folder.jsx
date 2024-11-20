import React from "react";
import FolderList from "./folder-list.jsx";
import { select_folder, toggle_folder } from "../reducer.jsx";

const { connect } = require("react-redux");

class FolderComponent extends React.Component {
  render() {
    let selectedClass =
      this.props.selectedFolderId == this.props.id ? "selected" : "";
    let elements = [];
    let key = "note-name-" + this.props.id;
    const id = this.props.id;

    elements.push(
      <div
        key={key}
        onClick={this.props.onClick.bind(this)}
        className={selectedClass}
        id="{id}"
      >
        {this.props.title}
      </div>
    );

    var showChildren =
      this.props.children.length &&
      this.props.expandedFolderIds.indexOf(id) >= 0;
    if (showChildren) {
      key = "folder-list-" + id;
      elements.push(
        <FolderList
          key={key}
          level={this.props.level}
          parentId={id}
          items={this.props.children}
          selectedFolderId={this.props.selectedFolderId}
        />
      );
    }

    return <div>{elements}</div>;
  }
}

const Folder = connect(
  function (state) {
    return {};
  },

  function (dispatch) {
    return {
      onClick: function (event) {
        dispatch(select_folder({ id: this.props.id }));
        dispatch(toggle_folder({ id: this.props.id }));
      },
    };
  }
)(FolderComponent);

export default Folder;
