import React, { Component } from "react"
import { Button, Input, PriceSetter } from "../../atoms"
import "./styles.sass"

class AdminItemEditor extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.data
    // Check if it's a data image, or if we already fixed the URL
    let newUrl = this.props.data.image.match("data:") || this.props.data.image.match("/store/") ? this.props.data.image : "/store/" + this.props.data.image
    this.state.image = newUrl
    this.propagateChanges = this.props.propagateChanges.bind(this)
  }

  componentDidUpdate() {
    // if (this.state.toString() !== this.props.data.toString()) this.setState(this.props.data)
  }

  textController = (e, index, field) => {
    let value = e.target.value

    const onlyNumbers = /^[0-9\b]+$/
    const onlyDimensions = /^[0-9, x\b]+$/
    const onlyText = /^[A-Z, a-z\b]+$/
    const emptyValue = /^(?![\s\S])+$/

    switch (field) {
      case "type":
        if (!emptyValue.test(value) && !onlyText.test(value)) return
        break
      case "measurements":
        if (!emptyValue.test(value) && !onlyDimensions.test(value)) return
        break
      case "cost":
        if (!emptyValue.test(value) && !onlyNumbers.test(value)) return
        break
      default:
        // No limiters on the name
        this.setState({ name: value })
    }

    let newArray = [].concat(this.state.sizes)
    newArray[index][field] = value
    this.setState({ sizes: newArray })
  }

  addSize = () => {
    let newArray = [].concat(this.state.sizes)
    newArray.push({})
    this.setState({ sizes: newArray })
  }

  removeSize = index => {
    let newArray = [].concat(this.state.sizes)
    newArray.splice(index, 1)
    this.setState({ sizes: newArray })
  }

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
      <div id="editor-wrapper" className={this.props.enabled ? "item enabled" : "item disabled"}>
        <div id="editor">
          <div className="cancel" onClick={() => this.props.enableEditor(false)}>
            <i className="las la-times"></i>
          </div>
          <input id="filepicker" onChange={this.renderImageToPreview} style={{ display: "none" }} type="file" accept="jpg,png,jpeg,gif,bmp"></input>
          <img id="itemImage" onClick={() => document.getElementById("filepicker").click()} src={this.state.image} alt={this.state.name}></img>
          <Input placeholder={"Name"} type="name" textController={e => this.textController(e, null, "name")} autocomplete="title" className="admin" value={this.state.name} />
          <PriceSetter data={this.state.sizes} addSize={this.addSize} removeSize={this.removeSize} textController={this.textController} />
          <Button onSubmit={() => this.propagateChanges(this.state)} className="center">
            Save Changes
          </Button>
        </div>
      </div>
    )
  }
}

export default AdminItemEditor
