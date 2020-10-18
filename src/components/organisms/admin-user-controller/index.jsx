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

let newUser = {
  email: undefined,
  name: undefined,
  filename: "placeholder.png",
  privileges: 0,
  isNew: true
}

class AdminUserController extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      privilegeMenu: false,
      password1: false,
      password2: false,
      rawFile: undefined
    }
  }

  componentDidMount() {}

  fetchUser = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/users/fetch"
    return new Promise((resolve, reject) => {
      if (this.props.userid === "new") {
        this.setState(newUser)
        resolve(true)
      }
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

  renderImageToPreview = e => {
    let file = e.target.files[0]
    let reader = new FileReader()

    reader.onloadend = () => {
      this.setState({ filename: reader.result })
    }

    if (file) {
      this.setState({ rawFile: file }, reader.readAsDataURL(file))
    }
  }

  saveChanges = () => {
    let submission = new FormData()
    let location = this.state.isNew ? "/admin/users/new" : "/admin/users/update"
    let server = process.env.REACT_APP_API_URL + location
    let update = Object.assign({}, this.state)

    if (this.state.isNew) {
      if (this.state.password1 || this.state.password2) {
        if (this.state.password1 !== this.state.password2) {
          pageNotification([false, "Passwords must match!"])
          return
        }
      } else {
        pageNotification([false, "You must enter a password!"])
        return
      }
    } else if (this.state.password1 || this.state.password2) {
      if (this.state.password1 !== this.state.password2) {
        pageNotification([false, "Passwords must match!"])
        return
      }
    }

    update.password = this.state.password1
    delete update.password1
    delete update.password2

    let file = this.state.rawFile

    if (file?.name) {
      submission.append(file.name, file)
      delete update.filename
    }

    submission.append("data", JSON.stringify(update))

    fetch(server, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      body: submission
    })
      .then(res => {
        if (res.ok) {
          pageNotification([true, this.state.isNew ? "User Saved " : "Updates saved"])
          // if (this.state.isNew) document.location.href = "/admin/users"
        } else pageNotification([false, "Something went wrong, please try again!"])
      })
      .catch(err => pageNotification([false, "Something went wrong, try again!"]))
  }

  render() {
    return (
      <Async promiseFn={this.fetchUser}>
        {({ data, err, isLoading }) => {
          if (data) {
            let privilege = Object.keys(privileges)[this.state.privileges]
            return (
              <>
                <input type="file" id="fileinput" onChange={this.renderImageToPreview} accept="png,jpg,gif,bmp" />
                <img
                  src={this.state.filename.match("data:") ? this.state.filename : "/users/" + this.state.filename}
                  alt=""
                  onClick={() => document.getElementById("fileinput").click()}
                />
                <Input label="name" textController={this.textController} placeholder="Name" required type="name" value={this.state.name} />
                <Input label="email" textController={this.textController} placeholder="Email" required type="email" value={this.state.email} />
                <UserConsumer>
                  {({ user }) => {
                    return (
                      <>
                        {user.privileges >= this.state.privileges || user.email === this.state.email ? (
                          <>
                            <Input
                              label="Password"
                              name="password1"
                              textController={this.textController}
                              placeholder="Update Password"
                              type="password"
                              value={this.state.password1}
                            />
                            <Input
                              label="Password"
                              name="password2"
                              textController={this.textController}
                              placeholder="Confirm Password"
                              type="password"
                              value={this.state.password2}
                            />
                          </>
                        ) : null}
                      </>
                    )
                  }}
                </UserConsumer>
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
