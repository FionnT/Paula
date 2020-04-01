import React, { useState } from "react"
import { Cart } from "../../atoms"

export default function CartButton() {
  const [cartStatus, toggleCart] = useState(false)

  const handleCartDisplay = () => {
    let rendered
    if (cartStatus) rendered = <Cart />
    else rendered = null
    return rendered
  }

  return (
    <div>
      <span onClick={() => toggleCart(!cartStatus)}>
        <i className="las la-shopping-cart"></i>
      </span>
      {handleCartDisplay()}
    </div>
  )
}
