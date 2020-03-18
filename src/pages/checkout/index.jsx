import React, { useState } from "react"
// import { Button } from "../../components/atoms"
import { CardPayment, IDealPayment } from "../../components/atoms"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

// Setup Stripe.js and the Elements provider
const stripePromise = loadStripe("pk_test_ewYXsxzBelAK67VpC4LVJhbt000ScbJFsp")

function Checkout() {
  const [payment, updatePaymentType] = useState(<CardPayment />)
  const toggle = () => {
    if (payment.type.name == "CardPayment") updatePaymentType(<IDealPayment />)
    else updatePaymentType(<CardPayment />)
  }

  return (
    <Elements stripe={stripePromise}>
      <button onClick={toggle}></button>
      {payment}
    </Elements>
  )
}

export default Checkout
