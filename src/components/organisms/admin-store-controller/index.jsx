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
      visibleItems: [...props.availableItems, ...props.privateItems],
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
    if (JSON.stringify(this.state.visibleItems) !== JSON.stringify([...this.props.availableItems, ...this.props.privateItems]))
      this.setState({
        visibleItems: [...this.props.availableItems, ...this.props.privateItems]
      })
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

  togglePositionChanges = () => {
    let stablePositions = this.props.availableItems.filter(item => item.isPublished)

    if (!this.state.moveEnabled) {
      // An issue is introduced by moving items from Published <-> Private
      // wherein an items position is set to the length of the available items
      // meaning that at all times, if a single item is swapped between places, two items will always have the same isInPosition
      // Here we reset this, when enabling changing positions of items by changing all isInPosition to be the index of the item in the array
      stablePositions.forEach((item, index) => {
        item.isInPosition = index
        this.modifyAvailableItem(item)
      })
    } else {
      let server = process.env.REACT_APP_API_URL + "/store/update-positions"
      fetch(server, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(this.props.availableItems)
      }).then(res => {
        if (res.ok) {
          pageNotification([true, "Positions Saved"])
        } else pageNotification([false, "Something went wrong, refresh and try again!"])
      })
      // TODO: Send POST request to store positions
    }
    this.setState({ availableItems: stablePositions, moveEnabled: !this.state.moveEnabled })
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
    this.modifyAvailableItem({ UUID, isPublished, isInPosition: isPublished ? this.props.availableItems.length : 0 })

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
          <div className="lock" onClick={this.togglePositionChanges}>
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
            {this.state.visibleItems.map((item, index) =>
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
