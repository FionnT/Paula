import React, { Component } from "react"
import { Navigation, Login, Registration } from "../../components/molecules"
import { validateText, pageNotification } from "../../utilities"
import { Redirect } from "react-router-dom"
import { UserConsumer, UserProvider } from "../../context-providers"
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

  componentDidMount() {
    // let value = this.context
    /* perform a side-effect at mount using the value of MyContext */
  }

  onSubmit = (submitLocation, _callback) => {
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
        })
          .then(res => {
            if (res.status === 200) {
              pageNotification([true, "You are now logged in!"])
              resolve(res.json())
            } else pageNotification([false, "Please check your details and try again."])
          })
          .catch(err => {
            reject(err)
            this.emailNotification([false, "Couldn't find that combination of login details!"])
          })
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
            else return <Login data={user} textController={this.textUpdater} onSubmit={() => this.onSubmit(submitLocation).then(data => updateUser(data))} />
          }}
        </UserConsumer>
      </>
    )
  }
}

export default Authentication
