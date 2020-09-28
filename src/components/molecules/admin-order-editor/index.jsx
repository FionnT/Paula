import React, { Component } from "react"
import { pageNotification } from "../../../utilities"
import { UserConsumer } from "../../../context-providers"
import { Button, ReviewItem } from "../../../components/atoms"
import copy from "copy-to-clipboard"

import "./styles.sass"

class AdminOrderEditor extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.order
    this.updateHistory = this.props.updateHistory.bind(this)
    if (!this.state.status) document.location.href = "/admin/orders"
  }

  componentDidMount() {}

  copyText = ref => {
    console.log(this[ref])
    let text = this[ref].innerText
    copy(text)
    pageNotification([true, "Copied"])
  }

  resendNotification = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/orders/resend-notification"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ orderID: this.state.orderID })
    }).then(res => {
      if (res.ok) {
        pageNotification([true, "Email sent"])
      } else pageNotification([false, "Something went wrong, refresh and try again!"])
    })
  }

  confirmShipment = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/orders/confirm-shipment"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ orderID: this.state.orderID })
    }).then(res => {
      if (res.ok) {
        this.setState({ status: "shipped" }, pageNotification([true, "Confirmation email sent"]))
      } else if (res.status === 404) pageNotification([false, "Already marked as shipped!"])
      else pageNotification([false, "Something went wrong, refresh and try again!"])
    })
  }

  cancelOrder = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/orders/cancel"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ orderID: this.state.orderID })
    })
      .then(res => (res.ok ? res.json() : null))
      .then(res => {
        let status = res.status === 200 ? true : false

        pageNotification([status, res.message])
        this.updateHistory(document.location.pathname)

        this.setState({ status: res.state })

        // Fuck it
        let statusDisplay = document.getElementsByClassName("payed")[0]
        statusDisplay.className = res.state
        statusDisplay.innerHTML = res.state
      })
  }

  deleteOrder = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/orders/delete"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify({ orderID: this.state.orderID })
    })
      .then(res => (res.ok ? res : null))
      .then(res => {
        if (res) {
          pageNotification([true, "Order record deleted"])
          this.updateHistory("/admin/orders")
        } else pageNotification([false, "Something went wrong, refresh and try again!"])
      })
  }

  render() {
    return (
      <>
        <div id="shipping-details">
          <h2>Shipping Details</h2>
          <div className="text-wrapper shipping" ref={shipping => (this.shipping = shipping)}>
            <p>{this.state.name},</p>
            <p>{this.state.streetAddress},</p>
            <p>{this.state.city},</p>
            <p>{this.state.zip},</p>
            <p>{this.state.country}</p>
          </div>
          <div className="copy">
            <i className="las la-clipboard" onClick={() => this.copyText("shipping")}></i>
          </div>
          <div className="text-wrapper">
            <p>-</p>
            <p className="email" ref={email => (this.email = email)}>
              {this.state.email}
            </p>
            <p className="edit" onClick={this.resendNotification}>
              Resend status email
            </p>
          </div>
          <div className="copy">
            <i className="las la-clipboard" onClick={() => this.copyText("email")}></i>
          </div>
        </div>
        <div id="items-container">
          {this.state.items?.map(item => (
            <ReviewItem {...item} key={item.UUID + item.state} disabled="true" className="admin" />
          ))}
          <div className="total-cost">
            <p>Total Cost:</p>
            <p>{this.state.purchaseCost} &euro;</p>
          </div>
        </div>
        <div id="controls">
          <UserConsumer>
            {({ user }) => {
              return (
                <>
                  {this.state.status === "payed" ? (
                    <Button onSubmit={this.confirmShipment} className={user.privileges < 1 ? "center" : null}>
                      Mark Shipped
                    </Button>
                  ) : null}
                  {user.privileges >= 1 ? (
                    this.state.status !== ("cancelled" || "failed") ? (
                      <Button onSubmit={this.cancelOrder} className="cancel">
                        Cancel & Refund
                      </Button>
                    ) : (
                      <Button onSubmit={this.deleteOrder} className="cancel">
                        Delete Order
                      </Button>
                    )
                  ) : null}
                </>
              )
            }}
          </UserConsumer>
        </div>
      </>
    )
  }
}

export default AdminOrderEditor
