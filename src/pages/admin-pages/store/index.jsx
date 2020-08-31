import React, { Component } from "react"
import { validateText, pageNotification } from "../../../utilities"
import { Navigation } from "../../../components/organisms"
import { AdminStoreItem, AdminItemEditor, Input } from "../../../components/atoms"
import { CartConsumer } from "../../../context-providers/cart-details"
import "./styles.sass"

function Store() {
  return (
    <CartConsumer>
      {({ cart, updateCart, availableItems }) => {
        return <StoreContainer availableItems={availableItems} />
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

  textController = e => {
    validateText(e, false, this.state, data => {
      data.visibleItems = this.state.availableItems.filter(item => item.name.match(data.search))
      this.setState(data)
    })
  }

  enableEditor = data => {
    console.log(data)
    this.setState({ selectedItem: data, editorEnabled: !this.state.editorEnabled })
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="admin">
          <Input type="search" name="search" value={this.state.search} className="admin" textController={e => this.textController(e)}></Input>
          <div id="store-items">
            {this.state.visibleItems.map(item => (
              <AdminStoreItem {...item} enableEditor={this.enableEditor} />
            ))}
          </div>
          {this.state.editorEnabled ? <AdminItemEditor type="store" data={this.state.selectedItem} enableEditor={this.enableEditor} /> : null}
        </div>
      </>
    )
  }
}

export default Store
