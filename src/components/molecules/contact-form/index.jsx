import React, { Component } from "react"
import { Input, Button } from "../../atoms"
import { validateText, pageNotification } from "../../../utilities"
class ContactForm extends Component {
  state = {
    email: undefined,
    name: undefined,
    text: undefined,
    valid: false
  }

  submit = () => {
    if (this.state.valid !== true) return
    // We won't get here unless everything was entererd correctly
    let server = process.env.REACT_APP_API_URL + "/contact"
    fetch(server, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        this.setState(
          {
            email: undefined,
            name: undefined,
            text: undefined,
            valid: false
          },
          this.emailNotification(parseInt(res.status))
        )
      })
      .catch(err => {
        this.emailNotification(502)
      })
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

  emailNotification = selectedSetting => {
    const messages = {
      200: [true, "We'll be in touch soon!"],
      403: [false, "Sending that email was forbidden."],
      502: [false, "Server was unable to send that email!"]
    }
    pageNotification(messages[selectedSetting])
  }

  render() {
    return (
      <>
        <Input type="email" value={this.state.email} textController={this.textUpdater} placeholder="Your email address *" autoComplete="email" name="email" label="Email" />
        <Input type="name" value={this.state.name} textController={this.textUpdater} placeholder="Your name" autoComplete="name" label="Name" />
        <Input type="text" value={this.state.text} textController={this.textUpdater} placeholder="Your message *" />
        <Button onSubmit={this.submit}>Submit Your message</Button>
      </>
    )
  }
}

export default ContactForm
