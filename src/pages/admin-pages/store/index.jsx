import React, { Component } from "react"
import { validateText, pageNotification } from "../../../utilities"
import { Navigation } from "../../../components/organisms"
import { AdminItemEditor } from "../../../components/molecules"
import { AdminStoreItem, Input } from "../../../components/atoms"
import { CartConsumer } from "../../../context-providers/cart-details"
import "./styles.sass"

function Store() {
  return (
    <CartConsumer>
      {({ cart, updateCart, availableItems, modifyAvailableItem }) => {
        return <StoreContainer availableItems={availableItems} modifyAvailableItem={modifyAvailableItem} />
      }}
    </CartConsumer>
  )
}

class StoreContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleItems: props.availableItems,
      availableItems: props.availableItems,
      selectedItem: undefined,
      editorEnabled: false,
      search: undefined,
      valid: false
    }
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
      data.visibleItems = this.state.availableItems.filter(item => item.name.toLowerCase().match(data.search.toLowerCase()))
      this.setState(data)
    })
  }

  enableEditor = data => {
    this.setState({ selectedItem: data, editorEnabled: !this.state.editorEnabled })
  }

  propagateChanges = data => {
    let modifiableData = Object.assign({}, data)

    this.props.modifyAvailableItem(data) // Store it on client side, so we don't need to refresh
    this.enableEditor(false)

    let submission = new FormData()
    let postLocation = data.isNew ? "/store/new" : "/store/update"
    let server = process.env.REACT_APP_API_URL + postLocation

    if (data.image.match("data:")) {
      submission.append(modifiableData.rawFile.name, modifiableData.rawFile)
      delete modifiableData.image
    }

    delete modifiableData.backgroundImage
    delete modifiableData.enableEditor
    delete modifiableData.rawFile
    delete modifiableData.isNew

    submission.append("data", JSON.stringify(modifiableData))

    fetch(server, {
      credentials: "include",
      method: "POST",
      mode: "cors",
      body: submission
    }).then(res => (res.ok ? pageNotification([true, "Update Saved"]) : pageNotification([false, "Server error, please try again!"])))
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="admin">
          <Input type="search" name="search" value={this.state.search} className="searchbar" textController={e => this.textController(e)}></Input>
          <div id="store-items">
            {this.state.visibleItems.map((item, index) => (
              <AdminStoreItem {...item} enableEditor={this.enableEditor} key={index} />
            ))}
          </div>
          {this.state.editorEnabled ? (
            <AdminItemEditor type="store" data={this.state.selectedItem} enableEditor={this.enableEditor} propagateChanges={this.propagateChanges} />
          ) : null}
        </div>
      </>
    )
  }
}

export default Store
