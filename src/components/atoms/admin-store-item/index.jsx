import React, { Component } from "react"
import "./styles.sass"

class AdminStoreItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}

    // Store props in State
    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))
  }

  changeSelectedSize = size => {
    this.setState({ currentDetails: size })
  }

  togglePublish = () => {
    this.state.isPublished ? this.setState({ isPublished: false }) : this.setState({ isPublished: true })
  }

  enableEditor = () => this.props.enableEditor(this.state)

  render() {
    return (
      <>
        <div className="admin-store-item">
          <div className="item-image" style={{ backgroundImage: "url(/store/" + this.state.image + ")" }} alt="Item"></div>
          <p>{this.state.name}</p>
          <div className="controls">
            <button onClick={this.togglePublish}>
              <i className={this.state.isPublished ? "lar la-eye" : "lar la-eye-slash"}></i>
            </button>
            <button onClick={this.enableEditor}>
              <i className="las la-cog"></i>
            </button>
            <button>
              <i className="las la-trash"></i>
            </button>
          </div>
        </div>
      </>
    )
  }
}

export default AdminStoreItem
