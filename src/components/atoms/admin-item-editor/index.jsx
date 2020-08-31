import React, { Component } from "react"
import "./styles.sass"
import Button from "../button"
import Input from "../input"
class AdminItemEditor extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.data
    this.state.prefix = "/" + this.props.type + "/"
  }

  render() {
    return (
      <div id="editor-wrapper" className={this.props.enabled ? "enabled" : "disabled"}>
        <div id="editor">
          <div className="cancel" onClick={() => this.props.enableEditor(false)}>
            <i className="las la-times"></i>
          </div>
          <img src={this.state.prefix + this.state.image} alt={this.state.name}></img>
          <Input placeholder="Name" />
          <Input placeholder="Name" />
          <Input placeholder="Name" />
          <Input placeholder="Name" />
          <Button className="center">Save Changes</Button>
        </div>
      </div>
    )
  }
}

export default AdminItemEditor
