import React, { createContext } from "react"
import Cookies from "universal-cookie"
import Async from "react-async"
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
  updateCart: () => {},
  availableItems: []
})

export class CartProvider extends React.Component {
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

      newDetails.items = existingItems.concat(newDetails.items)
    }

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
    newDetails.items.forEach(item => {
      newDetails.purchaseCost += item.purchaseCost * item.amount
    })

    let requiredCart = required_details // Cloning base object
    newDetails = Object.assign(requiredCart, newDetails)
    cookies.set("cart", newDetails, { path: "/" }) // store it in cookies too so we don't forget details
    this.setState({ cart: newDetails })
  }

  state = {
    cart: required_details,
    updateCart: this.updateCart,
    availableItems: []
  }

  componentDidMount() {
    const cookie = cookies.get("cart")
    // Avoid unneccessary re-render
    if (cookie) this.setState({ cart: cookie })
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

  render() {
    return (
      <Async promiseFn={this.fetchStoreItems}>
        {({ data, err, isLoading }) => {
          if (isLoading) return "Loading..."
          if (err) return <CartContext.Provider value={this.state}>{this.props.children}</CartContext.Provider> // defaults to empty
          if (data) return <CartContext.Provider value={this.state}>{this.props.children}</CartContext.Provider>
        }}
      </Async>
    )
  }
}

export const CartConsumer = CartContext.Consumer
