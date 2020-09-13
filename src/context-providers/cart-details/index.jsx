import React, { createContext } from "react"
import Async from "react-async"
import { Cookie } from "../../utilities"
import { requiredDetails, addressCookie, cartCookie, paymentCookie } from "./data-structures.js"

export const CartContext = createContext({
  cart: {},
  updateCart: () => {},
  availableItems: []
})

export class CartProvider extends React.Component {
  constructor() {
    super()
    this.state = {
      cart: requiredDetails,
      updateCart: this.updateCart,
      availableItems: [],
      modifyAvailableItem: this.modifyAvailableItem
    }
  }

  // Stores or retrives cookies
  manageCookies = (storingNewCookies, newDetails) => {
    if (storingNewCookies) {
      // Insert relevant data into respective object; data splitting
      Object.keys(addressCookie).forEach(key => (addressCookie[key] = newDetails[key]))
      Object.keys(cartCookie).forEach(key => (cartCookie[key] = newDetails[key]))
      Object.keys(paymentCookie).forEach(key => (paymentCookie[key] = newDetails[key]))

      // Store objects as Cookies
      Cookie.set("addressCookie", addressCookie)
      Cookie.set("cartCookie", cartCookie)
      Cookie.set("paymentCookie", paymentCookie)
    } else {
      const addressCookie = Cookie.get("addressCookie")
      const cartCookie = Cookie.get("cartCookie")
      const paymentCookie = Cookie.get("paymentCookie")
      let newDetails = requiredDetails
      newDetails = Object.assign(newDetails, addressCookie)
      newDetails = Object.assign(newDetails, cartCookie)
      newDetails = Object.assign(newDetails, paymentCookie)
      this.setState({ cart: newDetails })
    }
  }

  componentDidMount() {
    this.manageCookies(false)
  }

  updateCart = newDetails => {
    let existingItems = this.state.cart.items

    // Increment the order quantity instead of adding a duplicate
    if (newDetails.hasOwnProperty("items")) {
      newDetails.items.forEach((newItem, index) => {
        existingItems.forEach(existingItem => {
          if (newItem.UUID === existingItem.UUID && newItem.size === existingItem.size) {
            if (newItem.amount === 0) existingItem.amount = 1 // Prevent going to Zero via the Input
            if (newItem.amount === 1) existingItem.amount += newItem.amount
            else existingItem.amount = newItem.amount // The only place you can add more than one at a time is an input, and therefore that is canonical
            newDetails.items.splice(index, 1) // Delete it so we don't merge it back to state after we know it's a dupe
          }
        })
      })
    }

    // Assign stored items to request we're processing, or merge with existing if we are adding new items
    if (newDetails.hasOwnProperty("items")) newDetails.items = existingItems.concat(newDetails.items)
    else newDetails.items = this.state.cart.items

    // Parse a deletion request
    if (newDetails.hasOwnProperty("removeID")) {
      existingItems.forEach((existingItem, index) => {
        if (newDetails.removeID === existingItem.UUID && newDetails.size === existingItem.size) existingItems.splice(index, 1)
        newDetails.items = existingItems
      })
      delete newDetails.removeID
    }

    if (newDetails.hasOwnProperty("removeOne")) {
      existingItems.forEach(existingItem => {
        if (newDetails.removeOne === existingItem.UUID && newDetails.size === existingItem.size) {
          // Prevent going to Zero via the Knob
          if (existingItem.amount > 1) existingItem.amount -= 1
        }
        newDetails.items = existingItems
      })
      delete newDetails.removeOne
    }

    // Calculate total purchase cost
    newDetails.purchaseCost = 0
    if (newDetails.hasOwnProperty("items")) {
      newDetails.items.forEach(item => {
        newDetails.purchaseCost += item.purchaseCost * item.amount
      })
    }

    let requiredCart = requiredDetails // Cloning base object
    newDetails = Object.assign(requiredCart, newDetails)

    if (newDetails.hasOwnProperty("emptyCart")) {
      Object.keys(newDetails).forEach(key => {
        newDetails[key] = undefined
      })
      newDetails.items = [] // bug fix, must always be an array due to .map calls later on
    }

    this.manageCookies(true, newDetails)
    this.setState({ cart: newDetails })
  }

  fetchStoreItems = () => {
    return new Promise(resolve => {
      let server = process.env.REACT_APP_API_URL + "/store/items"
      fetch(server)
        .then(res => (res.ok ? res.json() : res))
        .then(res => {
          this.setState({ availableItems: res }, resolve(res))
        })
    })
  }

  modifyAvailableItem = data => {
    let newArray = [].concat(this.state.availableItems)

    newArray.forEach((item, index) => {
      if (item.UUID === data.UUID) {
        newArray[index] = data
        this.setState({ availableItems: newArray })
      }
    })
  }

  render() {
    return (
      <Async promiseFn={this.fetchStoreItems}>
        {({ data, err, isLoading }) => {
          if (isLoading) return <img src="/loading.gif" className="loading-image" alt="Page is loading" />
          if (err) return <CartContext.Provider value={this.state}>{this.props.children}</CartContext.Provider> // defaults to empty
          if (data) return <CartContext.Provider value={this.state}>{this.props.children}</CartContext.Provider>
        }}
      </Async>
    )
  }
}

export const CartConsumer = CartContext.Consumer
