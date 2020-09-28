import React, { Component } from "react"
import { validateText, pageNotification } from "../../../utilities"
import { Navigation } from "../../../components/organisms"
import { AdminUserEditor } from "../../../components/molecules"
import { AdminUserItem, Button, Input } from "../../../components/atoms"

import "./styles.sass"

const blankUser = {
  privileges: null,
  email: "",
  image: "add-image.png",
  name: "",
  isNew: true,
  isPublished: true
}

class AdminUserController extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleUsers: props.allUsers,
      allUsers: props.allUsers,
      selectedUser: undefined,
      editorEnabled: false,
      deleteDialogEnabled: false,
      search: undefined,
      valid: false
    }
  }

  textController = e => {
    validateText(e, false, this.state, data => {
      data.visibleUsers = this.state.allUsers.filter(item => item.name.toLowerCase().match(data.search.toLowerCase()) || item.email.toLowerCase().match(data.search.toLowerCase()))
      this.setState(data)
    })
  }

  enableEditor = data => {
    this.setState({ selectedItem: data, editorEnabled: !this.state.editorEnabled })
  }

  toggleDeleteDialog = data => this.setState({ selectedItem: data, deleteDialogEnabled: !this.state.deleteDialogEnabled })

  confirmDeletion = data => {
    let _id = data._id
    let server = process.env.REACT_APP_API_URL + "/store/delete-item"

    fetch(server, {
      credentials: "include",
      method: "POST", // or 'PUT'
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ _id })
    }).then(res => {
      if (res.ok) pageNotification([true, "User deleted"])
      else pageNotification([false, "Server error, please try again!"])
    })
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="admin">
          <Input type="search" name="search" value={this.state.search} className="searchbar" textController={e => this.textController(e)}></Input>
          <div id="users">
            {this.state.visibleUsers.map((item, index) => (
              <AdminUserItem {...item} enableEditor={this.enableEditor} toggleDeleteDialog={this.toggleDeleteDialog} key={index} />
            ))}
          </div>
          <div id="add-new-item" onClick={() => this.enableEditor(blankUser)}>
            <span>
              <i className="las la-plus"></i>
            </span>
          </div>

          {this.state.editorEnabled ? (
            <AdminUserEditor type="store" data={this.state.selectedItem} enableEditor={this.enableEditor} propagateChanges={this.propagateChanges} />
          ) : null}
          {this.state.deleteDialogEnabled ? (
            <div id="confirm-deletion">
              <h2>Are you sure you want to delete {this.state.selectedItem.name} ? </h2>
              <div>
                <Button onSubmit={() => this.confirmDeletion(this.state.selectedItem)}>Yes</Button>
                <Button onSubmit={() => this.toggleDeleteDialog(false)}>No</Button>
              </div>
            </div>
          ) : null}
        </div>
      </>
    )
  }
}

export default AdminUserController