import React, { Component } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { validateText } from "../../../utilities"
import { CardPayment, CreatePaymentIntent, ReviewItem, Input } from "../../../components/atoms"

const stripePromise = loadStripe("pk_test_ewYXsxzBelAK67VpC4LVJhbt000ScbJFsp")

class CheckoutForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: this.props.cart.email,
      valid: false
    }
    this.cart = this.props.cart
    this.updateCart = this.props.updateCart.bind(this)
    this.updateHistory = this.props.updateHistory.bind(this)
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.updateCart({ email: data.email })
    })
  }

  render() {
    return (
      <>
        <CreatePaymentIntent cart={this.cart} updateCart={this.updateCart}>
          <div className="left-column">
            <div id="shipping-details">
              <h2>Shipping Details</h2>
              <p>{this.cart.name},</p>
              <p>{this.cart.streetAddress},</p>
              <p>{this.cart.city},</p>
              <p>{this.cart.zip},</p>
              <p>{this.cart.country}</p>
              <p className="edit" onClick={() => this.updateHistory("/shop/shipping")}>
                Edit Shipping
              </p>
            </div>
            <div id="items-container">
              {this.cart.items.map(item => (
                <ReviewItem {...item} updateCart={null} key={item.UUID + item.size} disabled="true" />
              ))}
              <div className="total-cost">
                <p>Total Cost:</p>
                <p>{this.cart.purchaseCost} &euro;</p>
              </div>
              <p className="edit" onClick={() => this.updateHistory("/shop/review")}>
                Edit Cart
              </p>
            </div>
          </div>
          <div className="right-column">
            <Input textController={this.textUpdater} type="email" value={this.cart.email} placeholder="Contact email" label="email" className="fill" />
            <Elements stripe={stripePromise}>
              <CardPayment cart={this.cart} />
            </Elements>
          </div>
        </CreatePaymentIntent>
      </>
    )
  }
}

export default CheckoutForm
