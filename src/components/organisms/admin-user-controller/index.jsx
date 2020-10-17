import React, { Component } from "react"
import { Async } from "react-async"
import { Redirect } from "react-router-dom"
import { Button, Input } from "../../../components/atoms"
import { UserConsumer } from "../../../context-providers"
import { pageNotification, validateText } from "../../../utilities"
import "./styles.sass"

let privileges = {
  Assistant: { 0: "Can view and ship orders", 2: "Can view and manage galleries", 1: "Can view and manage store items", 3: "Can view and manage users" },
  Manager: { 0: "Can view, ship, and refund orders", 2: "Can view and manage galleries", 4: "Can view and manage store items", 6: "Can view and manage users" },
  Owner: {
    0: "Can view, ship, refund, and delete orders",
    2: "Can view, manage, and delete galleries",
    4: "Can view, manage, and delete store items",
    6: "Can view, manage, and delete users"
  },
  "Web Admin": {
    0: "Can view, ship, refund, and delete orders",
    2: "Can view, manage, and delete galleries",
    4: "Can view, manage, and delete store items",
    6: "Can view, manage, and delete users"
  }
}

class AdminUserController extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      privilegeMenu: false
    }
  }

  componentDidMount() {}

  fetchUser = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/user"
    return new Promise((resolve, reject) => {
      fetch(server, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ _id: this.props.userid })
      })
        .then(res => (res.ok ? res.json() : res))
        .then(res => {
          this.setState(res, resolve(true))
        })
        .catch(err => console.log(err))
    }).catch(err => console.log(err))
  }

  textController = event => {
    validateText(event, false, this.state, data => {
      this.setState(data)
    })
  }

  saveChanges = () =>
    new Promise((resolve, reject) => {
      let server = process.env.REACT_APP_API_URL + "/admin/users/update"
      fetch(server, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.state)
      })
        .then(res => (res.ok ? pageNotification([true, "Updates saved"]) : pageNotification([false, "Something went wrong, try again!"])))
        .catch(err => pageNotification([false, "Something went wrong, try again!"]))
    })

  render() {
    return (
      <Async promiseFn={this.fetchUser}>
        {({ data, err, isLoading }) => {
          if (data) {
            let privilege = Object.keys(privileges)[this.state.privileges]
            return (
              <>
                <img src={"/users/" + this.state.filename} alt="" />
                <Input label="name" textController={this.textController} placeholder="Name" required type="name" value={this.state.name} />
                <Input label="email" textController={this.textController} placeholder="Email" required type="email" value={this.state.email} />
                <div id="privileges" onMouseEnter={() => this.setState({ privilegeMenu: true })} onMouseLeave={() => this.setState({ privilegeMenu: false })}>
                  <div className="chevron">
                    <i className="las la-angle-down"></i>
                  </div>
                  <p>{privilege}</p>
                  <UserConsumer>
                    {({ user }) => {
                      let options = []
                      Object.keys(privileges).forEach((key, index) => {
                        if (key !== privilege && index <= user.privileges)
                          options.push(
                            <p key={key} onClick={() => this.setState({ privileges: index })} className={this.state.privilegeMenu.toString()}>
                              {key}
                            </p>
                          )
                      })
                      return options
                    }}
                  </UserConsumer>
                </div>
                <div className="permissions">
                  <div className="row">
                    {Object.keys(privileges[privilege]).map(key => {
                      return (
                        <div key={key}>
                          <p>
                            <i className={key % 2 ? "las la-times-circle" : "las la-check-circle"}></i> {privileges[privilege][key]}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="controls">
                  <UserConsumer>{({ user }) => (user.privileges >= 2 ? <Button className="delete">Delete</Button> : null)}</UserConsumer>
                  <Button onSubmit={this.saveChanges}>Save Changes</Button>
                </div>
              </>
            )
          } else if (err) return <Redirect to="/admin/users"></Redirect>
          else if (isLoading) return <img src="/loading.gif" style={{ marginTop: "15%" }} className="loading-image" alt="Page is loading" />
        }}
      </Async>
    )
  }
}

export default AdminUserController
