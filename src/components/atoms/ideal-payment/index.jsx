/**
 * Use the CSS tab above to style your Element's container.
 */
import React from "react"
import { IdealBankElement } from "@stripe/react-stripe-js"
import "./styles.sass"

const IDEAL_ELEMENT_OPTIONS = {
  // Custom styling can be passed to options when creating an Element
  style: {
    base: {
      padding: "10px 12px",
      color: "#32325d",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      }
    }
  }
}

function IDealPayment() {
  return (
    <label>
      iDEAL Bank
      <IdealBankElement options={IDEAL_ELEMENT_OPTIONS} />
    </label>
  )
}

export default IDealPayment
