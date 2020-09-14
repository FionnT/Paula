import React, { Component } from "react"
import { Async } from "react-async"
import { pageNotification } from "../../../utilities"
import { Redirect } from "react-router-dom"

class CreatePaymentIntent extends Component {
  constructor(props) {
    super(props)
    this.updateCart = props.updateCart.bind(this)
    this.existingOrder = props.existingOrder
  }

  createPaymentIntent = () => {
    const { cart } = this.props

    const intentData = JSON.stringify(cart)

    return new Promise((resolve, reject) => {
      let server = process.env.REACT_APP_API_URL + "/store/paymentintent"
      fetch(server, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        body: intentData
      })
        .then(res => (res.ok ? res.json() : res))
        .then(res => {
          if (res.error) {
            pageNotification(["false", res.error.raw.message])
            reject(<Redirect to="/shop/review" />)
          } else {
            this.updateCart({ paymentIntent: res.paymentIntent })
            cart.paymentIntent = res.paymentIntent
            resolve(true)
          }
        })
    })
  }

  render() {
    return (
      <Async promiseFn={this.createPaymentIntent}>
        {({ data, isLoading, isRejected, value }) => {
          if (isLoading) return <img src="/loading.gif" style={{ marginTop: "15%" }} className="loading-image" alt="Page is loading" />
          if (isRejected) return value
          if (data) return this.props.children
        }}
      </Async>
    )
  }
}

export default CreatePaymentIntent
