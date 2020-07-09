import React, { Component } from "react"
import { Async } from "react-async"

import { CheckoutForm } from "../../../components/molecules"
import { Navigation } from "../../../components/organisms"
import { CartConsumer } from "../../../context-providers"

import "./styles.sass"

// Setup Stripe.js and the Elements provider

class Checkout extends Component {
  updateHistory = place => this.props.history.push(place)

  state = {
    orderID: null,
    orderDetails: null
  }

  componentWillMount() {
    if (this.props.match.params && this.props.match.params.orderid !== this.state.orderID) this.setState({ orderID: this.props.match.params.orderid })
  }

  componentDidUpdate() {
    if (this.props.match.params && this.props.match.params.orderid !== this.state.orderID) this.setState({ orderid: this.props.location.state.shootname })
  }

  fetchOrder = () => {
    return new Promise((resolve, reject) => {
      if (!this.props.match || !this.props.match.params.orderid) resolve(true)
      else {
        const server = process.env.REACT_APP_API_URL + "/store/resume-order"
        fetch(server, {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          mode: "cors",
          body: JSON.stringify({ orderID: this.props.match.params.orderid })
        }).then(res => (res.ok ? resolve(res.json()) : this.props.history.push("/shop")))
      }
    })
  }

  render() {
    return (
      <Async promiseFn={this.fetchOrder}>
        {({ data, isLoading }) => {
          if (isLoading) return <img src="/loading.gif" style={{ marginTop: "15%" }} className="loading-image" alt="Page is loading" />
          else
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
                      return <CheckoutForm cart={Object.keys(data).length ? data : cart} updateCart={updateCart} updateHistory={this.updateHistory}></CheckoutForm>
                    }}
                  </CartConsumer>
                </div>
              </>
            )
        }}
      </Async>
    )
  }
}

export default Checkout
