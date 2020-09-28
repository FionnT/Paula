import React from "react"
import { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { Button } from "../../../components/atoms"
import { pageNotification } from "../../../utilities"

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

const CardPayment = props => {
  const [error, setError] = useState(null)
  const [status, updateStatus] = useState("Checkout")
  const [listenerSet, toggleListenerBool] = useState(false)
  const [payable, changePayability] = useState(true)
  const stripe = useStripe()
  const elements = useElements()
  const updateHistory = props.updateHistory.bind(this)
  const updateCart = props.updateCart.bind(this)

  // Handle real-time validation errors from the card Element.
  const handleChange = event => {
    toggleStatus(false, "Checkout") // Block user from navigating as soon as they start entering card details
    if (event.error) {
      setError(event.error.message)
    } else {
      setError(null)
    }
  }

  function preventUnload(e) {
    e.preventDefault()
    e.returnValue = "" // You can't actually change the message
  }

  const toggleStatus = (resetting, message, className) => {
    const button = document.getElementById("checkout-button")

    if (resetting) {
      console.log("should be gone")
      // Look, try adding an event listener instead
      // Then try fucking removing it!
      window.onbeforeunload = undefined
      toggleListenerBool(false)
      button.classList = "center"
      updateStatus("Checkout")
      changePayability(true)
    } else {
      // Don't let the user close the tab
      if (!listenerSet) {
        window.onbeforeunload = preventUnload
        toggleListenerBool(true)
      }
      button.classList.add(className)
      updateStatus(message)
    }
  }

  const handleSubmit = async event => {
    event.preventDefault()

    if (!payable || !stripe || !elements) return
    changePayability(false)
    toggleStatus(false, "Verifying Card", "processing")

    const paymentConfirmation = await stripe.confirmCardPayment(props.cart.paymentIntent, {
      payment_method: {
        card: elements.getElement(CardElement)
      }
    })

    if (paymentConfirmation.error) {
      pageNotification(["false", paymentConfirmation.error.message + "<br />Please try again."])
    } else if (paymentConfirmation.paymentIntent.status === "succeeded") {
      toggleStatus(true)
      updateCart({ emptyCart: true })
      updateHistory("/shop/thank-you")
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} id="stripe-payment-form">
        <div className="form-row">
          <label htmlFor="card-element">Credit or debit card</label>
          <p>Credit or debit card</p>
          <div id="accepted-payments">
            <img src="/visa.png" alt="Visa is accepted" />
            <img src="/mastercard.png" alt="Mastercard is accepted" />
            <img src="/amex.png" alt="American Express is accepted" />
          </div>
          <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} onChange={handleChange} />
          <div className="card-errors" role="alert">
            {error}
          </div>
        </div>
      </form>
      <Button id="checkout-button" className="center" onSubmit={handleSubmit}>
        {status}
      </Button>
    </>
  )
}

export default CardPayment
