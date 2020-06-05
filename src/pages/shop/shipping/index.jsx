import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { ShippingForm } from "../../../components/molecules"
import { Navigation } from "../../../components/organisms"
import { CartConsumer } from "../../../context-providers"
import "./styles.sass"

class Shipping extends Component {
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
              else return <ShippingForm cart={cart} updateCart={updateCart} />
            }}
          </CartConsumer>
        </div>
      </>
    )
  }
}

export default Shipping
