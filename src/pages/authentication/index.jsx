import React, { Component } from "react"
import { Login, Registration } from "../../components/molecules"
import { Navigation } from "../../components/organisms"
import { validateText, pageNotification } from "../../utilities"
import { Redirect } from "react-router-dom"
import { UserConsumer } from "../../context-providers"
import "./styles.sass"

class Authentication extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: undefined,
      password: undefined,
      valid: false
    }
    this.emailNotification = pageNotification.bind(this)
  }

  textUpdater = event => {
    validateText(event, this.state, data => {
      this.setState(data)
    })
  }

  onSubmit = (submitLocation, _callback) => {
    if (this.state.valid !== true) pageNotification([false, "Please check your details and try again."])
    else {
      let server = process.env.REACT_APP_API_URL + submitLocation
      fetch(server, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        mode: "cors",
        body: JSON.stringify(this.state)
      })
        .then(res => {
          if (res.status === 200) {
            document.location = "/"
          } else pageNotification([false, "Please check your details and try again."])
        })
        .catch(err => {
          console.log(err)
          this.emailNotification([false, "Couldn't find that combination of login details!"])
        })
    }
  }

  render() {
    return (
      <>
        <Navigation />
        <UserConsumer>
          {({ user }) => {
            const submitLocation = document.location.pathname.match("admin") ? "/admin/login" : "/shop/login"
            if (user.name) return <Redirect to="/" />
            else return <Login data={user} textController={this.textUpdater} onSubmit={() => this.onSubmit(submitLocation)} />
          }}
        </UserConsumer>
      </>
    )
  }
}

export default Authentication
