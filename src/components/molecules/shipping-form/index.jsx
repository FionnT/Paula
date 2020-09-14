import React, { Component } from "react"
import { Input, Button } from "../../../components/atoms"

import { validateText } from "../../../utilities"

class ShippingForm extends Component {
  constructor(props) {
    super(props)
    this.updateCart = this.props.updateCart
    this.updateHistory = this.props.updateHistory.bind(this)
    this.state = {
      name: undefined,
      streetAddress: undefined,
      city: undefined,
      state: undefined,
      country: undefined,
      zip: undefined,
      valid: false
    }

    Object.keys(this.state).forEach(key => {
      if (key !== "items" && key !== "purchaseCost") {
        this.state[key] = this.props.details[key]
      }
    })
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => this.setState(data))
  }

  validationCheck = details => {
    const redirectAndStore = () => {
      this.updateCart(this.state)
      this.updateHistory("/shop/checkout")
    }

    if (this.state.valid) redirectAndStore()
    else {
      // e.g. user hasn't inputted, but we have their details already
      let clonedState = Object.assign({}, this.state)
      validateText(false, clonedState, this.state, data => {
        if (data.valid) redirectAndStore()
      })
    }
  }

  render() {
    return (
      <>
        <div id="shipping-details">
          <Input
            textController={this.textUpdater}
            className="fill"
            type="name"
            value={this.state.name}
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
            value={this.state.streetAddress}
            placeholder="Address"
            label="Address"
            autoComplete="address-line1"
            name="address"
            required
          />
          <Input textController={this.textUpdater} type="city" value={this.state.city} placeholder="City" label="City" autoComplete="address-level2" name="city" required />
          <Input
            textController={this.textUpdater}
            type="state"
            value={this.state.state}
            placeholder="State"
            label="State, Province"
            autoComplete="address-level1"
            name="state province shipping region"
            required
          />
          <Input textController={this.textUpdater} type="country" value={this.state.country} placeholder="Country" label="Country" autoComplete="country" name="country" required />
          <Input textController={this.textUpdater} type="zip" value={this.state.zip} placeholder="Zip" label="Zip" autoComplete="postal-code" name="postal-code" required />
        </div>
        <div>
          <Button className="center" onSubmit={() => this.validationCheck(this.updateCart, this.state)}>
            Confirm & Pay
          </Button>
        </div>
      </>
    )
  }
}

export default ShippingForm

//
