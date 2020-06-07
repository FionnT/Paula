import React, { Component } from "react"
import { Login } from "../../components/molecules"
import { Navigation } from "../../components/organisms"
import { Redirect } from "react-router-dom"
import { UserConsumer } from "../../context-providers"
import "./styles.sass"

class Authentication extends Component {
  updateHistory = place => this.props.history.push(place)
  render() {
    return (
      <>
        <Navigation />
        <UserConsumer>
          {({ user, updateUser }) => {
            const submitLocation = document.location.pathname.match("admin") ? "/admin/login" : "/shop/login"
            if (user.email) return <Redirect to="/" />
            else return <Login data={user} updateUser={updateUser} location={submitLocation} updateHistory={this.updateHistory} />
          }}
        </UserConsumer>
      </>
    )
  }
}

export default Authentication
