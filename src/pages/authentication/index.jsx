import React, { Component } from "react"
import { Navigation, Login, Registration } from "../../components/molecules"
import "./styles.sass"

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      credentials: {
        email: undefined,
        password: undefined
      }
    }
  }

  textChange = event => {
    const submitted = {}
    event.target.style.border = "" // css rule takes over again, in case we had to highlight a fault previously
    let input = event.target.value
    let area = event.target.attributes.type.value
    submitted[area] = input
    if (this.state[area] !== input) this.setState({ credentials: submitted })
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

  submit() {
    alert(true)
  }

  rendered() {
    return (
      <>
        <Navigation />
        <Login textController={this.textChange} />
      </>
    )
  }

  render() {
    return <>{this.rendered()}</>
  }
}

export default Authentication
