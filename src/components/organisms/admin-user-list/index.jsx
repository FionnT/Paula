import React, { Component } from "react"
import { validateText, pageNotification } from "../../../utilities"
import { Navigation } from ".."
import { AdminUserItem, Button, Input } from "../../atoms"

import "./styles.sass"

class AdminUserList extends Component {
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

    this.updateHistory = this.props.updateHistory.bind(this)
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
    let server = process.env.REACT_APP_API_URL + "/admin/users/delete"

    fetch(server, {
      credentials: "include",
      method: "POST", // or 'PUT'
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ _id })
    }).then(res => {
      if (res.ok) {
        pageNotification([true, "User deleted"])
        document.location.reload()
      } else pageNotification([false, "Server error, please try again!"])
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
              <AdminUserItem {...item} updateHistory={this.updateHistory} toggleDeleteDialog={this.toggleDeleteDialog} key={index} />
            ))}
          </div>
          <div id="add-new-item" onClick={() => this.updateHistory("/admin/users/new")}>
            <span>
              <i className="las la-plus"></i>
            </span>
          </div>

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

export default AdminUserList
