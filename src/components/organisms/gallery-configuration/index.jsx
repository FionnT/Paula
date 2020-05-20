import React, { Component } from "react"
import { validateText } from "../../../utilities"
import { Input } from "../../atoms"
import { FileDropZone } from "../../molecules"
import { Button } from "../../../components/atoms"
import "./styles.sass"

const defaultState = {
  title: undefined,
  url: undefined,
  itemOrder: undefined,
  isInHomePosition: undefined,
  isOnHomeScreen: undefined,
  isPublished: undefined,
  passwordProtected: undefined,
  _id: undefined,
  printAvailable: undefined,
  printItems: undefined,
  length: undefined,
  __v: undefined
}
class GalleryConfiguration extends Component {
  constructor(props) {
    super(props)
    this.onGalleryDetailChange = props.onGalleryDetailChange.bind(this)
    this.state = this.props.selected
  }

  textUpdater = event => {
    validateText(
      event,
      false,
      this.state,
      data => {
        this.onGalleryDetailChange(data)
      },
      2
    )
  }

  componentDidUpdate() {
    const currentState = this.state
    const newProps = this.props.selected
    let modified
    if (newProps && typeof newProps === "object") {
      Object.keys(newProps).forEach(key => {
        if (currentState[key] !== newProps[key]) modified = true
      })
    }
    if (modified) {
      // Emptying the state before filling it again
      const emptyState = Object.assign({}, defaultState)
      const newState = Object.assign(emptyState, newProps)
      this.setState(newState)
    }
  }

  render() {
    const selected = this.state
    return (
      <div id="gallery-configuration">
        {this.props.selected !== false ? (
          <>
            <h2>{selected.title}</h2>
            <div id="gallery-input-fields">
              <Input type="title" textController={this.textUpdater} placeholder="Gallery Name *" value={selected.title ? selected.title : ""} required="true" />
              <Input
                type="url"
                textController={this.textUpdater}
                placeholder="Gallery URL *"
                immutable="/shoot/"
                immutableWidth="16%"
                mutableWidth="84%"
                value={selected.url ? selected.url : ""}
                required="true"
              />
            </div>
            <FileDropZone multiple={true} existing={selected} url={selected.url} accept="image/*" onGalleryDetailChange={this.onGalleryDetailChange}>
              Gallery Photos
            </FileDropZone>
            <div id="gallery-input-fields">
              <Input type="password" placeholder="Add a password?" />
            </div>
            <div style={{ width: "80.5%", margin: "50px 0" }}>
              <Button className="center">Save Gallery!</Button>
            </div>
          </>
        ) : null}
      </div>
    )
  }
}
export default GalleryConfiguration
