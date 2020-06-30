import React from "react"
import { Navigation } from "../../../components/organisms"
import { Button } from "../../../components/atoms"
import "./styles.sass"

export default function ThankYou(props) {
  return (
    <>
      <Navigation />
      <div id="store-container" className="thank-you">
        <img src="/thanks.png" alt="Thank you for your order!" />
        <p> We've received your order and are currently processing it. We'll let you know if you need to do anything! </p>
        <Button className="center" onSubmit={() => props.history.push("/")}>
          Go home!
        </Button>
      </div>
    </>
  )
}
