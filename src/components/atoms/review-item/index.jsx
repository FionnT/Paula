import React, { useState } from "react"
import "./styles.sass"

export default function ReviewItem(props) {
  const updateCart = props.updateCart?.bind(this)
  const [amount, incrementAmount] = useState(props.amount)

  const modifyAmount = e => {
    //
    if (e === "removeOne") {
      // Using the minus knob
      if (amount > 1) {
        incrementAmount(amount - 1)
        updateCart({ removeOne: props.UUID, size: props.size })
      }
    } else if (isNaN(e.target.value)) {
      // Using the plus knowb
      updateCart({ items: [{ size: props.size, amount: amount + 1, UUID: props.UUID }] })
      incrementAmount(amount + 1)
    } else {
      // Using direct input
      let { value, min } = e.target
      value = Math.max(Number(min), Number(value)) // Returns the number which is higher between the two, min or current value
      if (value === 1) updateCart({ items: [{ size: props.size, amount: 0, UUID: props.UUID }] }) // Passing 1 as the amount simply adds another item, but we want it to be canonical
      updateCart({ items: [{ size: props.size, amount: value, UUID: props.UUID }] })
      incrementAmount(value)
    }
  }

  return (
    <div className="item noselect" key={props.UUID}>
      <div className="item-image" style={{ backgroundImage: "url(/store/" + props.image + ")" }}></div>
      <div className="item-description">
        <h3>{props.name}</h3>
        <p>
          {props.type?.replace(/^\w/, c => c.toUpperCase())} - {props.size}
        </p>
      </div>
      <div className="quantity-selector">
        {!props.disabled ? (
          <>
            <div onClick={() => modifyAmount("removeOne")}>-</div>
            <input value={amount} min="1" type="number" onChange={e => modifyAmount(e)} />
            <div onClick={modifyAmount}>+</div>
          </>
        ) : (
          <input className="noselect" value={amount} disabled />
        )}
      </div>
      <h2>{amount * props.purchaseCost ? props.purchaseCost : props.cost} &euro;</h2>
      {!props.disabled ? (
        <div className="remove-item" onClick={() => updateCart({ removeID: props.UUID, size: props.size })}>
          <i className="las la-times"></i>
        </div>
      ) : null}
    </div>
  )
}
