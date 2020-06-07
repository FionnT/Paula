import React, { createContext } from "react"
import { Cookie } from "../../utilities"
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

// Worst case scenario, somoene can see the admins panel frontend UI
// They won't be able to pull server data to populate the UI however
// Any call to the server which requires auth will also destroy the user if it fails

export class UserProvider extends React.Component {
  updateUser = async newUser => {
    let logout_url = process.env.REACT_APP_API_URL + "/logout"
    let update_url = process.env.REACT_APP_API_URL + "/update_user"
    if (!Object.keys(newUser).length) {
      await fetch(logout_url, { credentials: "include" })
      this.setState({ user: public_metadata })
    } else if (newUser.isDifferent) {
      await fetch(update_url, { credentials: "include" })
    } else {
      this.setState({ user: newUser })
    }
  }

  state = {
    user: public_metadata,
    updateUser: this.updateUser
  }

  verifySession = () => {
    return new Promise((resolve, reject) => {
      let server = process.env.REACT_APP_API_URL + "/verify_session"
      fetch(server, { credentials: "include", mode: "cors" })
        .then(res => (res.ok ? res.json() : res))
        .then(res =>
          res.status !== 401
            ? this.setState({ user: res }, () => {
                Cookie.set("userCookie", this.state.user, { path: "/" })
                resolve(true)
              })
            : this.setState({ user: public_metadata }, resolve(true))
        )
        .catch(error => {
          console.error("Error:", error)
          reject()
        })
    })
  }

  componentDidMount() {
    const userCookie = Cookie.get("userCookie")
    if (userCookie) this.setState({ user: userCookie, lastVerified: Date.now() })
  }
  render() {
    return (
      <Async promiseFn={this.verifySession}>
        {({ data, err, isLoading }) => {
          if (isLoading) return <img src="/loading.gif" className="loading-image" alt="Page is loading" />
          if (err) return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider> // defaults to empty
          if (data) return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>
        }}
      </Async>
    )
  }
}

export const UserConsumer = UserContext.Consumer
