import React, { Component } from "react"
import { Redirect } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { CardPayment, CreatePaymentIntent, ReviewItem, Input } from "../../../components/atoms"
import { Navigation } from "../../../components/organisms"
import { CartConsumer } from "../../../context-providers"
import { validateText } from "../../../utilities"
import "./styles.sass"

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe("pk_test_ewYXsxzBelAK67VpC4LVJhbt000ScbJFsp")

class Checkout extends Component {
  // const [payment, updatePaymentType] = useState()
  state = {
    email: undefined
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

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
              return (
                <CreatePaymentIntent cart={cart} updateCart={updateCart}>
                  <div className="left-column">
                    <div id="shipping-details">
                      <h2>Shipping Details</h2>
                      <p>{cart.name},</p>
                      <p>{cart.streetAddress},</p>
                      <p>{cart.city},</p>
                      <p>{cart.zip},</p>
                      <p>{cart.country}</p>
                      <p className="edit" onClick={() => this.props.history.push("/shop/shipping")}>
                        Edit Shipping
                      </p>
                    </div>
                    <div id="items-container">
                      {cart.items.map(item => (
                        <ReviewItem {...item} updateCart={null} key={item.UUID + item.size} disabled="true" />
                      ))}
                      <div className="total-cost">
                        <p>Total Cost:</p>
                        <p>{cart.purchaseCost} &euro;</p>
                      </div>
                      <p className="edit" onClick={() => this.props.history.push("/shop/review")}>
                        Edit Cart
                      </p>
                    </div>
                  </div>
                  <div className="right-column">
                    <Input textController={this.textUpdater} type="email" value={this.state.email} placeholder="Contact email" label="email" className="fill" />
                    <Elements stripe={stripePromise}>
                      <CardPayment cart={cart} />
                    </Elements>
                  </div>
                </CreatePaymentIntent>
              )
            }}
          </CartConsumer>
        </div>
      </>
    )
  }
}

export default Checkout
