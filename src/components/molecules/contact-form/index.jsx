import React, { Component } from "react"
import { Input, Button } from "../../atoms"

class ContactForm extends Component {
  state = {
    email: undefined,
    name: undefined,
    text: undefined
  }

  submit = () => {
    const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    for (let item in this.state) {
      let text = this.state[item]
      if (item === "name") continue
      else {
        if (item === "email" && isValidEmail.test(text)) continue
        if (item === "text" && text?.length > 1) continue
      }
      // we won't get here unless something hasn't been entered correctly
      let faultingElement = document.getElementById("contact").querySelectorAll("." + item)[0].children[1]
      faultingElement.style.borderBottom = "1px solid red"
      return false
    }
    // we won't get here unless everything was entererd correctly
    let x = process.env.REACT_APP_API_URL + "/contact"
    fetch(x, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state)
    })
      .then(res => {
        this.emailNotification(parseInt(res.status))
      })
      .catch(err => {
        console.log(err)
      })
  }

  textChange = event => {
    const submitted = {}
    event.target.style.border = "" // css rule takes over again, in case we had to highlight a fault previously
    let input = event.target.value
    let area = event.target.attributes.type.value
    submitted[area] = input
    if (this.state[area] !== input) this.setState(submitted)
    if (area === "text") {
      const textarea = event.target
      const onTextAreaInput = () => {
        textarea.style.height = "auto"
        textarea.style.height = textarea.scrollHeight + "px"
      }
      textarea.style.height = textarea.scrollHeight
      textarea.style.overflowY = "hidden"
      textarea.addEventListener("input", onTextAreaInput)
    }
  }

  emailNotification = message => {
    const messages = {
      200: [true, "We'll be in touch soon!"],
      403: [false, "Sending that email was forbidden."],
      502: [false, "Server was unable to send that email!"]
      // etc.
    }
    const notifier = document.getElementById("notifier")
    notifier.className = messages[message][0]
    notifier.innerHTML = messages[message][1]
    notifier.style.opacity = 1
    setTimeout(() => {
      notifier.style.opacity = 0
    }, 2500)
  }

  render() {
    return (
      <React.Fragment>
        <Input type="email" textController={this.textChange} placeholder="Your email address *" />
        <Input type="name" textController={this.textChange} placeholder="Your name" />
        <Input type="text" textController={this.textChange} placeholder="Your message *" />
        <Button onSubmit={this.submit}>Submit Your message</Button>
      </React.Fragment>
    )
  }
}

export default ContactForm
