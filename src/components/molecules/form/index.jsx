import React, { Component } from "react"
import { Input, Button } from "../../atoms"

class Form extends Component {
  state = {
    email: undefined,
    name: undefined,
    text: undefined
  }
  submit = () => {
    for (let item in this.state) {
      let textEntry = this.state[item]
      if ((textEntry && textEntry !== "") || item === "name") continue
      else return false
    }
    console.log(this.state) // TODO: add message posting
  }

  onTextAreaInput = () => {
    this.style.height = "auto"
    this.style.height = this.scrollHeight + "px"
  }

  textChange = event => {
    const submitted = {}
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

  render() {
    return (
      <React.Fragment>
        <Input type="email" textController={this.textChange} placeholder="Your email address *" />
        <Input type="name" textController={this.textChange} placeholder="Your name" />
        <Input type="text" textController={this.textChange} placeholder="Your message *" />
        <Button onClick={this.submit}>Submit Your message</Button>
      </React.Fragment>
    )
  }
}

export default Form
