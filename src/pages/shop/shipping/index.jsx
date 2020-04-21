import React, { Component } from "react"
import { Navigation } from "../../../components/organisms"
import { Input, Button } from "../../../components/atoms"
import { validateText } from "../../../utilities"
import { Redirect } from "react-router-dom"
import { CartConsumer } from "../../../context-providers"
import "./styles.sass"

class Shipping extends Component {
  state = {
    name: undefined,
    streetAddress: undefined,
    city: undefined,
    state: undefined,
    country: undefined,
    zip: undefined,
    valid: false
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

  validationCheck = (updateCart, cart) => {
    const redirectAndStore = () => {
      updateCart(this.state)
      this.props.history.push("/shop/checkout")
    }

    if (this.state.valid) redirectAndStore()
    else {
      // e.g. user hasn't inputted, but we have their details already
      let clonedState = this.state
      Object.keys(cart)
        .filter(key => key in clonedState)
        .forEach(key => (clonedState[key] = cart[key]))

      validateText(false, clonedState, this.state, data => {
        if (data.valid) redirectAndStore()
      })
    }
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="billing review-order">
          <div id="order-stage">
            <p>Review Order</p>
            <span>-</span>
            <p className="active">Shipping Details</p>
            <span>-</span>
            <p>Confirm & Pay</p>
          </div>
          <CartConsumer>
            {({ cart, updateCart }) => {
              if (!cart.items.length) return <Redirect to="/shop" />
              else {
                const { name, streetAddress, city, state, country, zip } = cart
                return (
                  <>
                    <div id="shipping-details">
                      <Input
                        textController={this.textUpdater}
                        className="fill"
                        type="name"
                        value={name}
                        placeholder="Full Name"
                        label="Name"
                        autocomplete="name"
                        name="name"
                        required
                      />
                      <Input
                        textController={this.textUpdater}
                        className="fill"
                        type="streetAddress"
                        value={streetAddress}
                        placeholder="Address"
                        label="Address"
                        autoComplete="address-line1"
                        name="address"
                        required
                      />
                      <Input textController={this.textUpdater} type="city" value={city} placeholder="City" label="City" autoComplete="address-level2" name="city" required />
                      <Input
                        textController={this.textUpdater}
                        type="state"
                        value={state}
                        placeholder="State"
                        label="State, Province"
                        autoComplete="address-level1"
                        name="state province shipping region"
                        required
                      />
                      <Input
                        textController={this.textUpdater}
                        type="country"
                        value={country}
                        placeholder="Country"
                        label="Country"
                        autoComplete="country"
                        name="country"
                        required
                      />
                      <Input textController={this.textUpdater} type="zip" value={zip} placeholder="Zip" label="Zip" autoComplete="postal-code" name="postal-code" required />
                    </div>
                    <div onClick={() => this.validationCheck(updateCart, cart)}>
                      <Button className="center">Confirm & Pay</Button>
                    </div>
                  </>
                )
              }
            }}
          </CartConsumer>
        </div>
      </>
    )
  }
}

export default Shipping
