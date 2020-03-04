import React, { Component, useState } from "react"
// import { Button } from "../../components/atoms"
import { CardPayment, IDealPayment } from "../../components/atoms"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe("pk_test_ewYXsxzBelAK67VpC4LVJhbt000ScbJFsp")

function Checkout() {
  const [type, updateType] = useState(<CardPayment />)
  const toggle = () => {
    console.log(type)
    if (type.type.name == "CardPayment") updateType(<IDealPayment />)
    else updateType(<CardPayment />)
  }

  return (
    <Elements stripe={stripePromise}>
      <button onClick={toggle}></button>
      {type}
    </Elements>
  )
}

export default Checkout
