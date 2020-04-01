import React from "react"
import { Navigation } from "../../components/organisms"
import { StoreItems } from "../../components/molecules"
import { CartProvider, CartConsumer } from "../../context-providers/cart-details"
import "./styles.sass"

export default function Shop() {
  // Resets scrolling because homepage controls it initially
  ;(() => {
    document.documentElement.style.overflow = "auto"
    document.body.style.overflow = "auto"
  })()
  return (
    <>
      <Navigation />
      <CartProvider>
        <CartConsumer>
          {({ cart, updateCart }) => {
            return (
              <div id="store-container">
                <StoreItems updateCart={updateCart} />
              </div>
            )
          }}
        </CartConsumer>
      </CartProvider>
    </>
  )
}
