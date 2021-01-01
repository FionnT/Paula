import React, { Component } from "react"
import { validateText, pageNotification } from "../../../utilities"
import { Navigation } from "../../../components/organisms"
import { AdminItemEditor } from "../../../components/molecules"
import { AdminStoreItem, Button, Input } from "../../../components/atoms"

import "./styles.sass"

const blankItem = {
  UUID: false,
  sizes: [{}],
  image: "add-image.png",
  name: "",
  isNew: true,
  isPublished: true
}

class AdminStoreController extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleItems: props.availableItems,
      availableItems: props.availableItems,
      privateItems: props.privateItems,
      selectedItem: undefined,
      editorEnabled: false,
      moveEnabled: false,
      deleteDialogEnabled: false,
      search: undefined,
      valid: false
    }
    this.addItem = this.props.addItem.bind(this)
    this.modifyAvailableItem = this.props.modifyAvailableItem.bind(this)
    this.removeAvailableItem = this.props.removeAvailableItem.bind(this)
  }

  componentDidUpdate() {
    let boolean = false
    this.state.availableItems.forEach((item, index) => {
      if (JSON.stringify(item) !== JSON.stringify(this.props.availableItems[index])) boolean = true
    })
    if (boolean) this.setState({ availableItems: this.props.availableItems, visibleItems: this.props.availableItems })
  }

  textController = e => {
    validateText(e, false, this.state, data => {
      data.visibleItems = this.state.allItems.filter(item => item.name.toLowerCase().match(data.search.toLowerCase()))
      this.setState(data)
    })
  }

  enableEditor = data => {
    this.setState({ selectedItem: data, editorEnabled: !this.state.editorEnabled })
  }

  propagateChanges = data => {
    let modifiableData = Object.assign({}, data)

    // Store it on client side, so we don't need to refresh
    if (!data.isNew) this.modifyAvailableItem(data)
    else this.addItem(data)

    this.enableEditor(false)

    let submission = new FormData()
    let postLocation = data.isNew ? "/store/new" : "/store/update"
    let server = process.env.REACT_APP_API_URL + postLocation

    if (data.image.match("data:")) {
      submission.append(modifiableData.rawFile.name, modifiableData.rawFile)
      delete modifiableData.image
      delete modifiableData.backgroundImage
      delete modifiableData.rawFile
    } else {
      // Cleanup any changes we made to the image field to make it work client side
      modifiableData.image = modifiableData.image.match("/") ? modifiableData.image.split("/").slice(-1)[0] : modifiableData.image
    }

    delete modifiableData.enableEditor

    submission.append("data", JSON.stringify(modifiableData))

    fetch(server, {
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: submission
    }).then(res => {
      if (res.ok) {
        if (modifiableData.isNew) pageNotification([true, "Item added"])
        else pageNotification([true, "Update Saved"])
      } else pageNotification([false, "Server error, please try again!"])
    })
  }

  toggleDeleteDialog = data => this.setState({ selectedItem: data, deleteDialogEnabled: !this.state.deleteDialogEnabled })

  confirmDeletion = data => {
    let UUID = data.UUID
    let server = process.env.REACT_APP_API_URL + "/store/delete-item"

    fetch(server, {
      credentials: "include",
      method: "POST", // or 'PUT'
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ UUID })
    }).then(res => {
      if (res.ok) {
        this.removeAvailableItem({ UUID })
        pageNotification([true, "Item deleted"])
        this.toggleDeleteDialog(false)
      } else pageNotification([false, "Server error, please try again!"])
    })
  }

  togglePublishState = (UUID, isPublished) => {
    this.modifyAvailableItem({ UUID, isPublished })

    let server = process.env.REACT_APP_API_URL + "/store/toggle-publish"
    fetch(server, {
      method: "POST", // or 'PUT'
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ UUID, isPublished })
    }).then(res => (res.ok ? pageNotification([true, "Publish state changed"]) : pageNotification([false, "Server error, please try again!"])))
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="admin">
          <Input type="search" name="search" value={this.state.search} className="searchbar" textController={e => this.textController(e)}></Input>
          <div className="lock" onClick={() => this.setState({ moveEnabled: !this.state.moveEnabled })}>
            {this.state.moveEnabled ? <i className="las la-lock-open"></i> : <i className="las la-lock"></i>}
          </div>
          <div id="store-items">
            <span className="item-type">
              <p></p>
              <p className="active">Active</p>
              <p></p>
            </span>
            {this.state.visibleItems.map((item, index) =>
              item.isPublished ? (
                <AdminStoreItem
                  className="length"
                  {...item}
                  enableEditor={this.enableEditor}
                  moveEnabled={this.state.moveEnabled}
                  index={index}
                  toggleDeleteDialog={this.toggleDeleteDialog}
                  togglePublishState={this.togglePublishState}
                  key={index}
                />
              ) : null
            )}
            <span className="item-type">
              <p></p>
              <p className="active">Hidden</p>
              <p></p>
            </span>
            {this.state.privateItems.map((item, index) =>
              !item.isPublished ? (
                <AdminStoreItem {...item} enableEditor={this.enableEditor} toggleDeleteDialog={this.toggleDeleteDialog} togglePublishState={this.togglePublishState} key={index} />
              ) : null
            )}
          </div>
          <div id="add-new-item" onClick={() => this.enableEditor(blankItem)}>
            <span>
              <i className="las la-plus"></i>
            </span>
          </div>
          {this.state.editorEnabled ? (
            <AdminItemEditor type="store" data={this.state.selectedItem} enableEditor={this.enableEditor} propagateChanges={this.propagateChanges} />
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

export default AdminStoreController
