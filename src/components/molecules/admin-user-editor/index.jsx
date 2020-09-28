import React, { Component } from "react"
import { UserConsumer } from "../../../context-providers"
import { Button, Input } from "../../atoms"
import "./styles.sass"

let englishPrivileges = {
  0: "Assistant",
  1: "Manager",
  2: "Owner",
  3: "Web Admin"
}

class AdminUserEditor extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.data

    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))

    this.state.image = "/users/" + this.state.filename

    // this.propagateChanges = this.props.propagateChanges.bind(this)
  }

  componentDidUpdate() {
    // if (this.state.toString() !== this.props.data.toString()) this.setState(this.props.data)
  }

  textController = (e, index, field) => {}

  renderImageToPreview = e => {
    let file = e.target.files[0]
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({ image: reader.result })
    }

    if (file) {
      reader.readAsDataURL(file)
      this.setState({ rawFile: file })
    }
  }

  render() {
    return (
      <div id="editor-wrapper" className={this.props.enabled ? "enabled" : "disabled"}>
        <div id="editor">
          <div className="cancel" onClick={() => this.props.enableEditor(false)}>
            <i className="las la-times"></i>
          </div>
          <input id="filepicker" onChange={this.renderImageToPreview} style={{ display: "none" }} type="file" accept="jpg,png,jpeg,gif,bmp"></input>
          <img id="itemImage" onClick={() => document.getElementById("filepicker").click()} src={this.state.image} alt={this.state.name}></img>
          <Input placeholder={"Name"} type="name" textController={e => this.textController(e, null, "name")} autocomplete="title" className="admin" value={this.state.name} />
          <Input placeholder={"Email"} type="email" textController={e => this.textController(e, null, "name")} autocomplete="email" className="admin" value={this.state.email} />

          <Button onSubmit={() => this.propagateChanges(this.state)} className="center">
            Save Changes
          </Button>
        </div>
      </div>
    )
  }
}

export default AdminUserEditor
