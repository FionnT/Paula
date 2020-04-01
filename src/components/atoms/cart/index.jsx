import React from "react"
import { CartConsumer } from "../../../context-providers"
import "./styles.sass"

export default function Cart() {
  return (
    <>
      <p>
        <i className="las la-square-full"></i>
      </p>
      <div id="cart-menu">
        <CartConsumer>
          {({ cart, updateCart }) => {
            return (
              <>
                <div className="cart-item">
                  <div className="item-image"></div>
                  <div className="item-description">
                    <h3>Dath Beis</h3>
                    <p>A3 Print - 27 x 32.4cm</p>
                  </div>
                  <div> </div>
                </div>
                <div className="after"></div>
                <div className="cart-item">
                  <div className="item-image"></div>
                  <div className="item-description">
                    <h3>Dath Beis</h3>
                    <p>A3 Print - 27 x 32.4cm</p>
                  </div>
                  <div>
                    <span></span>
                  </div>
                </div>
              </>
            )
          }}
        </CartConsumer>
      </div>
    </>
  )
}