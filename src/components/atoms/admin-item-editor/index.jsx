import React, { Component } from "react"
import "./styles.sass"
import Button from "../button"
import Input from "../input"
class AdminItemEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    // Store props in State
    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))
  }

  render() {
    return (
      <div id="editor-wrapper">
        <div id="editor">
          <img src={"/store/893effd5-2043-46e3-9fe6-59a9b3f17044.jpg"}></img>

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
