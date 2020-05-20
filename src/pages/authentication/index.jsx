import React, { Component } from "react"
import { Login } from "../../components/molecules"
import { Navigation } from "../../components/organisms"
import { Cookie, validateText, pageNotification } from "../../utilities"
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
  }

  textUpdater = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

  onSubmit = (submitLocation, updateUser) => {
    if (this.state.valid !== true) pageNotification([false, "Please check your details and try again."])
    else {
      return new Promise((resolve, reject) => {
        let server = process.env.REACT_APP_API_URL + submitLocation
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
          updateUser(res)
          Cookie.set("userCookie", res)
          // this.props.history.push("/")
        })
        .catch(err => {
          console.log(err)
          pageNotification([false, "Please check your details and try again."])
        })
    }
  }

  render() {
    return (
      <>
        <Navigation />
        <UserConsumer>
          {({ user, updateUser }) => {
            const submitLocation = document.location.pathname.match("admin") ? "/admin/login" : "/shop/login"
            if (user.name) return <Redirect to="/" />
            else return <Login data={user} textController={this.textUpdater} onSubmit={() => this.onSubmit(submitLocation, updateUser)} />
          }}
        </UserConsumer>
      </>
    )
  }
}

export default Authentication
