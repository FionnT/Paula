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
  isPasswordProtected: undefined,
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
    this.onToggleGalleryType = props.onToggleGalleryType.bind(this)
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

  toggleType = (type, e) => {
    Array.from(document.querySelectorAll(".gallery-type div span")).forEach(element => element.classList.remove("active"))
    this.onToggleGalleryType(type, this.state._id)
    e.target.classList.add("active")
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
      // Emptying the state before filling it again, this.setState() will not overwrite if the new value is "undefined"
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
            <div className="gallery-input-fields">
              <Input type="title" textController={this.textUpdater} placeholder="Gallery Name *" value={selected.title ? selected.title : ""} required="true" />
              <Input
                type="url"
                textController={this.textUpdater}
                placeholder="Gallery URL *"
                immutable="/shoot/"
                immutableWidth="16%"
                mutableWidth="82%"
                value={selected.url ? selected.url : ""}
                required="true"
              />
            </div>
            <div className="gallery-type">
              <p>Gallery Type</p>
              <div>
                <span onClick={e => this.toggleType("homeGalleries", e)} className={selected.isOnHomeScreen ? "active" : null}>
                  Published
                </span>
                <span onClick={e => this.toggleType("privateGalleries", e)} className={selected.isOnHomeScreen ? null : selected.isPublished ? "active" : null}>
                  Private
                </span>
                <span onClick={e => this.toggleType("unpublishedGalleries", e)} className={selected.isOnHomeScreen ? null : !selected.isPublished ? "active" : null}>
                  Unpublished
                </span>
              </div>
            </div>
            {selected.isPublished && !selected.isOnHomeScreen ? (
              <div className="gallery-input-fields">
                <Input type="password" style={{ margin: "0 auto" }} textController={this.textUpdater} placeholder="Add a password?" />
                <Input type="password2" style={{ margin: "0 auto" }} textController={this.textUpdater} placeholder="Confirm Password" />
              </div>
            ) : null}
            <FileDropZone multiple={true} existing={selected} url={selected.url} accept="image/*" onGalleryDetailChange={this.onGalleryDetailChange}>
              Gallery Photos
            </FileDropZone>

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
