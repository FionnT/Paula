import React, { createContext } from "react"
import Cookies from "universal-cookie"
const cookies = new Cookies()

// TODO: Add async call to server to fetch items details here, so we only need to make the call once and can then pass it down

const required_details = {
  items: [],
  purchaseCost: undefined,
  email: undefined,
  addressOne: undefined,
  addressTwo: undefined,
  postCode: undefined,
  city: undefined,
  country: undefined
}

export const CartContext = createContext({
  cart: {},
  updateCart: () => {}
})

export class CartProvider extends React.Component {
  updateCart = newDetails => {
    let existingItems = this.state.cart.items
    Object.keys(newDetails).forEach((key, index) => {
      if (key === "items") {
        newDetails.items.forEach((item, index) => {
          existingItems.forEach(existingItem => {
            if (item.id === existingItem.id) {
              existingItem.amount += 1
              newDetails.items.splice(index, 1) // delete it so we don't merge it back to state after we know it's a dupe
            }
          })
        })
        newDetails.items = existingItems.concat(newDetails.items)
      }
    })

    let requiredCart = required_details // cloning base object
    newDetails = Object.assign(requiredCart, newDetails)
    cookies.set("cart", newDetails, { path: "/" }) // store it in cookies too so we don't forget details
    this.setState({ cart: newDetails })
  }

  state = {
    cart: required_details,
    updateCart: this.updateCart
  }

  componentDidUpdate() {
    if (this.state.cart.items.length) document.getElementsByClassName("la-shopping-cart")[0].style.color = "coral"
  }

  componentDidMount() {
    const cookie = cookies.get("cart")
    // avoid unneccessary re-render
    if (cookie)
      this.setState({ cart: cookie }, () => {
        if (this.state.cart.items.length) document.getElementsByClassName("la-shopping-cart")[0].style.color = "coral"
      })
  }

  render() {
    return <CartContext.Provider value={this.state}>{this.props.children}</CartContext.Provider>
  }
}

export const CartConsumer = CartContext.Consumer
