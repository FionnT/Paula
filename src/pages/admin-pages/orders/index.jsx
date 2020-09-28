import React, { Component } from "react"
import { validateText } from "../../../utilities"
import { Navigation } from "../../../components/organisms"
import { Input, AdminOrderItem } from "../../../components/atoms"
import { Async } from "react-async"

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visibleOrders: undefined,
      allOrders: props.allUsers,
      selectedOrder: undefined,
      search: undefined,
      fetchedOrders: false,
      valid: false
    }
  }

  textController = e => {
    validateText(e, false, this.state, data => {
      data.visibleOrders = this.state.allOrders.filter(
        item => item.name.toLowerCase().match(data.search.toLowerCase()) || item.email.toLowerCase().match(data.search.toLowerCase())
      )
      this.setState(data)
    })
  }

  fetchAllOrders = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/orders"
    return new Promise((resolve, reject) => {
      fetch(server, { credentials: "include", mode: "cors" })
        .then(res => (res.ok ? res.json() : reject()))
        .then(res => {
          this.setState({ allOrders: res, visibleOrders: res, fetchedOrders: true }, () => resolve(res))
        })
    })
  }

  render() {
    return (
      <>
        <Navigation />
        <div id="store-container" className="admin">
          <Input type="search" name="search" value={this.state.search} className="searchbar" textController={e => this.textController(e)}></Input>
          <div id="users">
            {this.state.fetchedOrders ? (
              this.state.visibleOrders.map((item, index) => <AdminOrderItem {...item} key={index} />)
            ) : (
              <Async promiseFn={this.fetchAllOrders}>
                {({ data, err, isLoading }) => {
                  if (isLoading) return <img src="/loading.gif" className="loading" alt="Page is loading" />
                  if (data) data.map((item, index) => <AdminOrderItem {...item} key={index} />)
                }}
              </Async>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default Orders
