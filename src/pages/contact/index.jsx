import React from "react"
import { Navigation, ContactForm } from "../../components/molecules"

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
