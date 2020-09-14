import React from "react"
import { Button, ReviewItem } from "../../../components/atoms"
import { Navigation } from "../../../components/organisms"
import { CartConsumer } from "../../../context-providers"
import { Link, Redirect } from "react-router-dom"
import "./styles.sass"

export default function ReviewOrder() {
  return (
    <>
      <Navigation />
      <div id="store-container" className="review-order">
        <div id="order-stage">
          <p className="active">Review Order</p>
          <span>-</span>
          <p>Shipping Details</p>
          <span>-</span>
          <p>Confirm & Pay</p>
        </div>
        <CartConsumer>
          {({ cart, updateCart }) => {
            if (!cart.items.length) return <Redirect to="/shop"></Redirect>
            else
              return (
                <>
                  <div id="items-summary">
                    <div id="grid-description">
                      <p>Item</p>
                      <p>Quantity</p>
                      <p>Price</p>
                    </div>
                    <div id="items-container">
                      {cart.items.map(item => (
                        <ReviewItem {...item} updateCart={updateCart} key={item.UUID + item.size} />
                      ))}
                    </div>
                  </div>
                  <div id="order-summary">
                    <h2>Order Summary</h2>
                    <div>
                      <p>Subtotal</p>
                      <p>{cart.purchaseCost} &euro;</p>
                    </div>
                    <div>
                      <p>Shipping</p>
                      <p>Free</p>
                    </div>
                    <div>
                      <p>Total</p>
                      <p>{cart.purchaseCost} &euro;</p>
                    </div>
                    <Link to="/shop/shipping">
                      <Button className="center">Shipping & Billing</Button>
                    </Link>
                  </div>
                </>
              )
          }}
        </CartConsumer>
      </div>
    </>
  )
}
