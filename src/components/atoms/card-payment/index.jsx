import React from "react"
import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import "./styles.sass"

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "black",
      fontFamily: "'Source Sans Pro', sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "18px",
      fontWeight: "300",
      textAlign: "center",
      lineHeight: "30px",
      "::placeholder": {
        color: "#coral  "
      }
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  }
}

// POST the token ID to your backend.
async function stripeTokenHandler(token) {
  let server = process.env.REACT_APP_API_URL + "/shop/charge"
  const response = await fetch(server, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token: token.id })
  })

  return response.json()
}

const CardPayment = () => {
  const [error, setError] = useState(null)
  const stripe = useStripe()
  const elements = useElements()

  // Handle real-time validation errors from the card Element.
  const handleChange = event => {
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }

  // Handle form submission.
  const handleSubmit = async event => {
    event.preventDefault()
    const card = elements.getElement(CardElement)
    const result = await stripe.createToken(card)
    if (result.error) {
      // Inform the user if there was an error.
      setError(result.error.message)
    } else {
      setError(null)
      // Send the token to your server.
      stripeTokenHandler(result.token)
    }
  }

  return (
    <form onSubmit={handleSubmit} id="stripe-payment-form">
      <div className="form-row">
        <label htmlFor="card-element">Credit or debit card</label>
        <p>Credit or debit card</p>
        <div id="accepted-payments">
          <img src="/visa.png" alt="stripe badge" />
          <img src="/mastercard.png" alt="stripe badge" />
          <img src="/amex.png" alt="stripe badge" />
        </div>
        <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
        <div className="card-errors" role="alert">
          {error}
        </div>
      </div>
    </form>
  )
}

export default CardPayment
