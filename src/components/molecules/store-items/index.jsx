import React, { Component } from "react"
import "./styles.sass"

class StoreItems extends Component {
  addItem = item => {
    this.props.updateCart({ items: [{ id: item, amount: 1 }], purchaseCost: 15 })
  }
  render() {
    return (
      <>
        <div className="store-item">
          <div className="item-image" style={{ backgroundImage: "url(/galleries/dath-beis/1.jpg" }}>
            <div>
              <span></span>
              <p>A3 Print - 27 x 32.4cm </p>
            </div>
          </div>
          <div className="item-details">
            <h3>Dath Beis</h3>
            <p>250$</p>
          </div>
          <span onClick={() => this.addItem("test")}>
            <i className="las la-cart-plus"></i>
          </span>
        </div>
        <div className="store-item">
          <div className="item-image" style={{ backgroundImage: "url(/galleries/dath-beis/1.jpg" }}>
            <div>
              <span></span>
              <p>A3 Print - 27 x 32.4cm </p>
            </div>
          </div>
          <div className="item-details">
            <h3>Dath Beis</h3>
            <p>250$</p>
          </div>
          <span onClick={() => this.addItem("tsdasdasest2")}>
            <i className="las la-cart-plus"></i>
          </span>
        </div>
      </>
    )
  }
}

export default StoreItems
