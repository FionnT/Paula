import React, { Component } from "react"
import { Input } from "../../atoms"

class Form extends Component {
  state = {
    email: undefined,
    name: undefined,
    text: undefined
  }
  submit = () => {
    for (let item in this.state) {
      let textEntry = this.state[item]
      if (textEntry && textEntry !== "") {
        //continue
      } else if (item === "name") continue
      else return false
    }
    console.log(this.state)
  }

  textChange = event => {
    const update = {}
    let text = event.target.value
    let field = event.target.attributes.type.value
    update[field] = text
    if (this.state[field] !== text) this.setState(update)
  }

  render() {
    return (
      <React.Fragment>
        <Input type="email" textController={this.textChange} placeholder="Your email address *" />
        <Input type="name" textController={this.textChange} placeholder="Your name" />
        <Input type="text" textController={this.textChange} placeholder="Your message *" />
        <button onClick={this.submit}>Submit Your message</button>
      </React.Fragment>
    )
  }
}

export default Form
