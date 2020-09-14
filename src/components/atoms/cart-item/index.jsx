import React from "react"

import "./styles.sass"

export default function CartItem(props) {
  const updateCart = props.updateCart.bind(this)
  return (
    <div className="cart-item" key={props.keyValue}>
      <div className="item-image" style={{ backgroundImage: "url(/store/" + props.image + ")" }}>
        <p>{props.size}</p>
      </div>
      <div className="item-description">
        <h3>{props.name}</h3>
        <p>
          {props.type} - {props.purchaseCost} &euro;
        </p>
      </div>
      <span onClick={() => updateCart({ removeID: props.UUID, size: props.size })}>
        <i className="las la-times"></i>
      </span>
    </div>
  )
}
