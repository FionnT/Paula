import React from "react"
import { Navigation, Form } from "../../components/molecules"

import "./styles.sass"

export default function Contact() {
  return (
    <React.Fragment>
      <Navigation />
      <div id="contact">
        <h1>Lets stay in touch!</h1>
        <Form />
      </div>
    </React.Fragment>
  )
}
