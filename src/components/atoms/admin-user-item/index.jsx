import React, { Component } from "react"
import { UserConsumer } from "../../../context-providers"
import "./styles.sass"

let englishPrivileges = {
  0: "Assistant",
  1: "Manager",
  2: "Owner",
  3: "Web Admin"
}

class AdminUserItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.enableEditor = this.props.enableEditor.bind(this)

    // Store props in State
    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))

    this.state.backgroundImage = { backgroundImage: "url(/users/" + this.props.filename + ")" } // required or the style doesn't update
    this.state.privileges = englishPrivileges[this.props.privileges]
  }

  componentDidUpdate(prevProps) {
    let modified = {}
    Object.keys(this.props).forEach(key => {
      if (this.props[key] !== this.state[key] && key !== "privileges") {
        modified[key] = this.props[key]
      } else if (key === "privileges" && this.props.privileges !== prevProps.privileges) modified.privileges = englishPrivileges[this.props.privileges]
    })

    if (Object.keys(modified).length) this.setState(modified)
  }

  render() {
    return (
      <div className="admin-user-item">
        <div className="user-image" style={this.state.backgroundImage} alt="Item"></div>
        <div className="text-wrapper">
          <p>{this.state.name}</p>
          <p>|</p>
          <p>{this.state.email}</p>
          <p>|</p>
          <p>{this.state.privileges}</p>
        </div>
        <div className="controls">
          <UserConsumer>
            {({ user }) => {
              let canModify
              let canDelete

              if (user.privileges >= this.props.privileges) {
                canModify = (
                  <button onClick={() => this.enableEditor(this.state)}>
                    <i className="las la-cog"></i>
                  </button>
                )
              }
              if (user.privileges > this.props.privileges) {
                canDelete = (
                  <button onClick={() => this.props.toggleDeleteDialog(this.state)}>
                    <i className="las la-trash"></i>
                  </button>
                )
              }
              return (
                <>
                  {canModify}
                  {canDelete}
                </>
              )
            }}
          </UserConsumer>
        </div>
      </div>
    )
  }
}

export default AdminUserItem
