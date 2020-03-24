import React from "react"
import { ContactForm } from "../../components/molecules"
import { Navigation } from "../../components/organisms"

import "./styles.sass"

export default function Contact() {
  return (
    <React.Fragment>
      <Navigation />
      <div id="contact">
        <h1>Lets stay in touch!</h1>
        <ContactForm />
      </div>
    </React.Fragment>
  )
}
