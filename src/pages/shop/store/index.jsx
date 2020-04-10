import React from "react"
import { Navigation } from "../../../components/organisms"
import { StoreItem } from "../../../components/molecules"
import { CartConsumer } from "../../../context-providers/cart-details"
import "./styles.sass"

export default function Store() {
  // Resets scrolling because homepage controls it initially
  ;(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
  })()
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
