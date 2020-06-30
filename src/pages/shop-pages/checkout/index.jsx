import React, { Component } from "react"
import { Redirect } from "react-router-dom"

import { CheckoutForm } from "../../../components/molecules"
import { Navigation } from "../../../components/organisms"

import { CartConsumer } from "../../../context-providers"

import "./styles.sass"

// Setup Stripe.js and the Elements provider

class Checkout extends Component {
  updateHistory = place => this.props.history.push(place)
  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="review-order checkout">
          <div id="order-stage">
            <p>Review Order</p>
            <span>-</span>
            <p>Shipping Details</p>
            <span>-</span>
            <p className="active">Confirm & Pay</p>
          </div>
          <CartConsumer>
            {({ cart, updateCart }) => {
              if (!cart.items.length) return <Redirect to="/shop" />
              return <CheckoutForm cart={cart} updateCart={updateCart} updateHistory={this.updateHistory}></CheckoutForm>
            }}
          </CartConsumer>
        </div>
      </>
    )
  }
}

export default Checkout
