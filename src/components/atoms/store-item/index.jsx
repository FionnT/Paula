import React, { useState } from "react"
import "./styles.sass"

export default function StoreItem(props) {
  const [currentDetails, amendDetails] = useState(props.item.sizes[0])

  const addItem = item => {
    props.updateCart({ items: [{ ...item, size: currentDetails.measurements, type: currentDetails.type, purchaseCost: currentDetails.cost, amount: 1 }] })
  }

  // Reflect changes made by an admin without the need to refresh the page
  const backgroundImage = { backgroundImage: props.item.image.match("data:") ? "url(" + props.item.image + ")" : "url(/store/" + props.item.image + ")" }

  return (
    <>
      <div className="store-item">
        <div className="item-image" style={backgroundImage}></div>
        <div className="item-options">
          {props.item.sizes.map(size => {
            return (
              <p className={currentDetails.measurements === size.measurements ? "active" : ""} onClick={() => amendDetails(size)} key={size.measurements}>
                {size.measurements}
              </p>
            )
          })}
        </div>
        <div className="item-details">
          <h3>{props.item.name}</h3>
          <p>{currentDetails.type} - </p>
          <p>{currentDetails.cost} &euro;</p>
        </div>
        <span onClick={() => addItem(props.item)}>
          <i className="las la-cart-plus"></i>
        </span>
      </div>
    </>
  )
}
