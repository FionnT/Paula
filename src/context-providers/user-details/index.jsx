import React, { createContext } from "react"
import Async from "react-async"

const public_metadata = {
  name: undefined,
  email: undefined,
  filename: undefined,
  privileges: undefined
}

export const UserContext = createContext({
  user: {},
  updateUser: () => {}
})

export class UserProvider extends React.Component {
  updateUser = async newUser => {
    let logout_url = process.env.REACT_APP_API_URL + "/logout"
    let update_url = process.env.REACT_APP_API_URL + "/update_user"
    if (!Object.keys(newUser).length) {
      await fetch(logout_url, { credentials: "include" })
      this.setState({ user: newUser })
    } else if (newUser.isDifferent) await fetch(update_url, { credentials: "include" })
  }

  state = {
    user: public_metadata,
    updateUser: this.updateUser,
    lastVerified: undefined
  }

  verifySession = () => {
    return new Promise(resolve => {
      let server = process.env.REACT_APP_API_URL + "/verify_session"
      fetch(server, { credentials: "include" })
        .then(res => (res.ok ? res.json() : res))
        .then(res => {
          this.setState({ user: res, lastVerified: Date.now }, resolve(res))
        })
    })
  }

  render() {
    return (
      <Async promiseFn={this.verifySession}>
        {({ data, err, isLoading }) => {
          if (isLoading) return "Loading..."
          if (err) return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider> // defaults to empty
          if (data) return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>
        }}
      </Async>
    )
  }
}

export const UserConsumer = UserContext.Consumer
