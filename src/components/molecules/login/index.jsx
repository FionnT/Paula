import React, { Component } from "react"
import { Cookie, validateText, pageNotification } from "../../../utilities/"
import { Input, Button } from "../../atoms"
import "./styles.sass"

class Login extends Component {
  constructor(props) {
    super(props)
    this.updateHistory = this.props.updateHistory.bind(this)
    this.updateUser = this.props.updateUser.bind(this)
    this.state = {
      email: undefined,
      password: undefined,
      valid: false
    }
    Object.keys(this.state).forEach(key => (this.state[key] = this.props.data[key]))
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

  onSubmit = () => {
    if (this.state.valid != true) pageNotification([false, "Pleasdssdadse check your details and try again."])
    else {
      return new Promise((resolve, reject) => {
        let server = process.env.REACT_APP_API_URL + this.props.location
        fetch(server, {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          mode: "cors",
          body: JSON.stringify(this.state)
        }).then(res => {
          res.ok ? resolve(res.json()) : reject(false)
        })
      })
        .then(res => {
          this.updateUser(res)
          Cookie.set("userCookie", res)
          this.updateHistory("/")
        })
        .catch(err => {
          console.log(err)
          pageNotification([false, "Please check your details and try again."])
        })
    }
  }

  render() {
    return (
      <div id="login">
        <Input type="email" value={this.state.email} textController={this.textUpdater} onSubmit={this.onSubmit} placeholder="Your email" />
        <Input type="password" value={this.state.password} name="password" textController={this.textUpdater} onSubmit={this.onSubmit} placeholder="Your password" />
        <Button className="center" onSubmit={this.onSubmit}>
          Login
        </Button>
      </div>
    )
  }
}

export default Login
