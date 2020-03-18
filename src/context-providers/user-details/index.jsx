import React, { createContext } from "react"

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
  updateUser = newUser => {
    this.setState({ user: newUser })
  }

  state = {
    user: public_metadata,
    updateUser: this.updateUser,
    lastVerified: undefined
  }

  verifySession = () => {
    const { lastVerified } = this.state
    if (!lastVerified || Date.now() - lastVerified > 1000 * 60 * 5) {
      let server = process.env.REACT_APP_API_URL + "/verify_session"
      return new Promise((resolve, reject) => {
        fetch(server, { credentials: "include" }).then(res => {
          if (res.status === 200) resolve(res.json())
          else {
            this.setState({ user: public_metadata, lastVerified: Date.now() })
            return
          }
        })
      }).then(res => {
        let modified = false
        for (let key in this.state.user) if (this.state.user[key] !== res[key]) modified = true
        if (modified) this.setState({ user: res, lastVerified: Date.now() })
      })
    } else return
  }

  componentDidMount() {
    this.verifySession()
  }

  componentDidUpdate() {
    this.verifySession()
  }

  render() {
    return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>
  }
}

export const UserConsumer = UserContext.Consumer
