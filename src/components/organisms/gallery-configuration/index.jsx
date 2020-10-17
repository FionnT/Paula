import React, { Component } from "react"
import { validateText } from "../../../utilities"
import { Button, Input } from "../../atoms"
import { FileDropZone } from "../../molecules"
import { pageNotification } from "../../../utilities"
import "./styles.sass"
import { UserConsumer } from "../../../context-providers"

const defaultState = {
  title: undefined,
  url: undefined,
  itemOrder: undefined,
  isInHomePosition: undefined,
  isOnHomeScreen: undefined,
  isPublished: undefined,
  isPasswordProtected: undefined,
  isCreatingPassword: true, // Used as local boolean for display of password input fields
  password: false,
  _id: undefined,
  length: undefined
}
class GalleryConfiguration extends Component {
  constructor(props) {
    super(props)
    this.onGalleryDetailChange = props.onGalleryDetailChange.bind(this)
    this.onToggleGalleryType = props.onToggleGalleryType.bind(this)
    this.onDeleteGallery = props.onDeleteGallery.bind(this)
    this.state = this.props.selected
    this.state.creatingPassword = this.props.selected.password ? true : false // Used to make sure we don't swap to the UI used when there already is a password
  }

  textUpdater = event => validateText(event, false, this.state, data => this.onGalleryDetailChange(data), 2)

  toggleType = (type, e) => {
    Array.from(document.querySelectorAll(".gallery-type div span")).forEach(element => element.classList.remove("active"))
    this.onToggleGalleryType(type, this.state._id)
    e.target.classList.add("active")
  }

  componentDidUpdate() {
    const currentState = this.state
    const newProps = this.props.selected
    let modified
    if (typeof newProps === "object") {
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

  deleteGallery = action => {
    switch (action) {
      case "open":
        document.querySelectorAll(".delete-confirmation")[0].style.display = "block"
        return
      case "confirm":
        this.onDeleteGallery(this.state._id)
        document.querySelectorAll(".delete-confirmation")[0].style.display = "none"
        return
      case "cancel":
        document.querySelectorAll(".delete-confirmation")[0].style.display = "none"
        return
      default:
        return
    }
  }

  onGallerySumbit = () => {
    let submission = new FormData()
    let postLocation = this.state.isNew ? "/galleries/new" : "/galleries/update"
    let server = process.env.REACT_APP_API_URL + postLocation
    let editableState = Object.assign(defaultState, this.state)

    if (this.state.isNew) {
      this.state.itemOrder.forEach(file => submission.append(file.name, file))
      delete editableState.files
      submission.append("data", JSON.stringify(editableState))
    } else {
      this.state.itemOrder.forEach(file => {
        if (typeof file === "object") submission.append(file.name, file)
      })
      submission.append("data", JSON.stringify(this.state))
    }

    fetch(server, {
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: submission
    }).then(res =>
      res.ok
        ? pageNotification([true, "Gallery Saved!"])
        : res.status === 403
        ? pageNotification([false, "Gallery URL is taken, try another one!"])
        : pageNotification([false, "Server error, please try again!"])
    )
  }

  render() {
    const selected = this.state
    return (
      <div id="gallery-configuration">
        <div className="delete-confirmation">
          <p> Are you sure you want to delete {this.state.title}?</p>
          <Button onSubmit={() => this.deleteGallery("confirm")}>Yes</Button>
          <Button onSubmit={() => this.deleteGallery("cancel")}>No</Button>
        </div>
        <h2>{selected.title}</h2>
        <UserConsumer>
          {({ user }) => {
            if (user.privileges >= 2)
              return (
                <span className="delete-button" onClick={() => this.deleteGallery("open")}>
                  <i className="las la-trash"></i>
                </span>
              )
          }}
        </UserConsumer>
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
            <span onClick={e => this.toggleType("unpublishedGalleries", e)} className={selected.isOnHomeScreen ? null : selected.isPublished ? null : "active"}>
              Unpublished
            </span>
          </div>
        </div>
        {selected.isPublished && !selected.isOnHomeScreen ? (
          <div className="gallery-input-fields admin-gallery-password">
            {selected.isPasswordProtected && !selected.creatingPassword ? (
              <div id="password-confirmation">
                <Button>Password Protected &#10004;</Button>
                <Button onSubmit={() => this.onGalleryDetailChange({ isPasswordProtected: false, isCreatingPassword: true, _id: selected._id })}>Change or Remove</Button>
              </div>
            ) : (
              <>
                <Input
                  type="password"
                  name="password"
                  style={{ margin: "0 auto" }}
                  value={selected.password ? selected.password : null}
                  textController={this.textUpdater}
                  placeholder="Add a password?"
                />
                <Input
                  type="password"
                  name="password2"
                  style={{ margin: "0 auto" }}
                  value={selected.password2 ? selected.password2 : null}
                  textController={this.textUpdater}
                  placeholder="Confirm Password"
                />
              </>
            )}
          </div>
        ) : null}
        <FileDropZone multiple={true} existing={selected} url={selected.url} accept="image/*" onGalleryDetailChange={this.onGalleryDetailChange}>
          Gallery Photos
        </FileDropZone>
        <div style={{ width: `calc(100% - 41px)`, margin: "50px 0 100px 10px" }}>
          <Button className="center" onSubmit={this.onGallerySumbit}>
            {this.state.isNew ? "Save Gallery" : "Update Gallery"}
          </Button>
        </div>
      </div>
    )
  }
}

export default GalleryConfiguration
