import React, { Component } from "react"
import { Input, Button } from "../../atoms"
import "./styles.sass"

class Login extends Component {
  constructor(props) {
    super(props)
    this.textChange = this.props?.textController?.bind(this)
    this.submit = this.props?.submit?.bind(this)
    this.state = {
      credentials: {
        email: undefined,
        password: undefined
      }
    }
  }

  onSubmit = () => {
    const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    for (let item in this.state) {
      let text = this.state[item]
      if (item === "name") continue
      else {
        if (item === "email" && isValidEmail.test(text)) continue
        if (item === "password" && text?.length > 1) continue
      }
      // we won't get here unless something hasn't been entered correctly
      let faultingElement = document.getElementById("login").querySelectorAll("." + item)[0].children[1]
      faultingElement.style.borderBottom = "1px solid red"
      return false
    }
    // we won't get here unless everything was entererd correctly
    // fetch("http://paulatrojner.com:8080/ontact", {
    //   method: "POST", // or 'PUT'
    //   headers: {
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify(this.state)
    // })
    //   .then(res => {
    //     this.emailNotification(parseInt(res.status))
    //   })
    //   .catch(err => {
    //     console.log(err)
    //   })
  }

  rendered() {
    return (
      <>
        <div id="login">
          <Input type="email" textController={this.textChange} placeholder="Your email" />
          <Input type="password" textController={this.textChange} placeholder="Your password" />
          <Button className="center" onSubmit={this.onSubmit}>
            Login
          </Button>
        </div>
      </>
    )
  }

  render() {
    return <>{this.rendered()}</>
  }
}

export default Login
