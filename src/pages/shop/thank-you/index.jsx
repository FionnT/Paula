import React from "react"
import { Navigation } from "../../../components/organisms"

export default function ThankYou() {
  return (
    <>
      <Navigation />
      <div id="store-container">
        <h3> Thank you! </h3>
        <p> We've received your order and are currently processing it. We'll let you know if you need to do anything! </p>
      </div>
    </>
  )
}
