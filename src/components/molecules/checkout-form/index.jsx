import React, { Component } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CardPayment, CreatePaymentIntent, ReviewItem } from "../../../components/atoms"

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT_KEY)

class CheckoutForm extends Component {
  constructor(props) {
    super(props)

    this.cart = this.props.cart
    this.updateCart = this.props.updateCart.bind(this)
    this.updateHistory = this.props.updateHistory.bind(this)

    if (this.cart.orderID) this.updateCart(this.cart)
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
              <p>-</p>
              <p>{this.cart.email}</p>
              <p className="edit" onClick={() => this.updateHistory("/shop/shipping")}>
                Edit Details
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
            <Elements stripe={stripePromise}>
              <CardPayment cart={this.cart} updateCart={this.updateCart} updateHistory={this.updateHistory} email={this.cart.email} />
            </Elements>
          </div>
        </CreatePaymentIntent>
      </>
    )
  }
}

export default CheckoutForm
