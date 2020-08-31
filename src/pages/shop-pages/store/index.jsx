import React from "react"
import { Navigation } from "../../../components/organisms"
import { StoreItem } from "../../../components/atoms"
import { CartConsumer } from "../../../context-providers/cart-details"
import "./styles.sass"

export default function Store() {
  return (
    <>
      <Navigation />
      <CartConsumer>
        {({ cart, updateCart, availableItems }) => {
          return (
            <div id="store-container">
              {availableItems.map(item => (
                <StoreItem updateCart={updateCart} item={item} key={item.UUID} />
              ))}
            </div>
          )
        }}
      </CartConsumer>
    </>
  )
}
