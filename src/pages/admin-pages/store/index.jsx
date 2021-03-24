import React from "react"
import { CartConsumer } from "../../../context-providers/cart-details"
import { AdminStoreController } from "../../../components/organisms"

function Store() {
  return (
    <CartConsumer>
      {({ cart, updateCart, availableItems, addItem, modifyAvailableItem, removeAvailableItem, privateItems, repositionItems }) => {
        return (
          <AdminStoreController
            availableItems={availableItems}
            privateItems={privateItems}
            addItem={addItem}
            repositionItems={repositionItems}
            modifyAvailableItem={modifyAvailableItem}
            removeAvailableItem={removeAvailableItem}
          />
        )
      }}
    </CartConsumer>
  )
}

export default Store
