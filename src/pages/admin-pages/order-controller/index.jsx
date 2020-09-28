import React, { Component } from "react"
import { Async } from "react-async"
import { Redirect } from "react-router-dom"
import { AdminOrderEditor } from "../../../components/molecules"
import { Navigation } from "../../../components/organisms"

import "./styles.sass"

class AdminOrderController extends Component {
  // We always want to fetch the latest version of the record from DB in case there has been changes in the meantime.
  fetchOrder = () => {
    return new Promise((resolve, reject) => {
      if (!this.props.match || !this.props.match.params.orderid) resolve(true)
      else {
        const server = process.env.REACT_APP_API_URL + "/admin/orders/fetch"
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

  updateHistory = url => this.props.history.push(url)

  render() {
    return (
      <Async promiseFn={this.fetchOrder}>
        {({ data, isLoading }) => {
          if (isLoading) return <img src="/loading.gif" style={{ marginTop: "15%" }} className="loading-image" alt="Page is loading" />
          else if (data.length) {
            let order = data[0]
            return (
              <>
                <Navigation />
                <div id="store-container" className="admin manage">
                  <div id="order-status">
                    <p className={order.status}>{order.status}</p>
                  </div>
                  <AdminOrderEditor order={order} updateHistory={this.updateHistory}></AdminOrderEditor>
                </div>
              </>
            )
          } else return <Redirect to="/admin/orders" />
        }}
      </Async>
    )
  }
}

export default AdminOrderController
