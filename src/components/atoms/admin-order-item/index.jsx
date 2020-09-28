import React, { Component } from "react"
import { Link } from "react-router-dom"
import "./styles.sass"

class AdminOrderItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    // Store props in State
    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))
  }

  componentDidUpdate(prevProps) {
    let modified = {}
    Object.keys(this.props).forEach(key => {
      if (this.props[key] !== this.state[key]) {
        modified[key] = this.props[key]
      }
    })

    if (Object.keys(modified).length) this.setState(modified)
  }

  render() {
    return (
      <div className="admin-order-item">
        <div className="text-wrapper">
          <p className={this.state.status}>{this.state.status}</p>
          <p>|</p>
          <p>{this.state.name}</p>
          <p>|</p>
          <p>{this.state.email}</p>
          <p>|</p>
          <p>{this.state.purchaseCost} &euro;</p>
        </div>
        <div className="controls">
          <Link to={"/admin/orders/manage/" + this.state.orderID}>
            <button>
              <i className="las la-cog"></i>
            </button>
          </Link>
        </div>
      </div>
    )
  }
}

export default AdminOrderItem
