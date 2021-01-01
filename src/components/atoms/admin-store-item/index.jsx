import React, { Component } from "react"
import { UserConsumer } from "../../../context-providers"
import "./styles.sass"

class AdminStoreItem extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.enableEditor = this.props.enableEditor.bind(this)
    // Store props in State
    Object.keys(this.props).forEach(key => (this.state[key] = this.props[key]))

    // Check if it's a data image, or if we already fixed the URL
    let newUrl = this.props.image.match("data:") || this.props.image.match("store") ? "url(" + this.props.image + ")" : "url(/store/" + this.props.image + ")"

    this.state.backgroundImage = { backgroundImage: newUrl } // required or the style doesn't update
  }

  componentDidUpdate() {
    // Parse image special case
    if (this.props.image.toString() !== this.state.image.toString()) {
      let newUrl = this.props.image.match("data:") || this.props.image.match("store") ? "url(" + this.props.image + ")" : "url(/store/" + this.props.image + ")"
      this.setState({ image: this.props.image, backgroundImage: { backgroundImage: newUrl } })
    }

    // Parse every other case
    let modified = {}
    Object.keys(this.props).forEach(key => {
      if (key !== "image" && key !== "backgroundImage" && this.props[key] !== this.state[key]) {
        modified[key] = this.props[key]
      }
    })

    if (Object.keys(modified).length) this.setState(modified)
  }

  changeSelectedSize = size => {
    this.setState({ currentDetails: size })
  }

  render() {
    return (
      <div className={"admin-store-item " + this.props.className}>
        <div className="item-image" style={this.state.backgroundImage} alt="Item"></div>
        <p>{this.state.name}</p>
        <div className="controls">
          {this.props.isPublished ? (
            <div className={"order " + this.props.moveEnabled}>
              {this.props.index !== 0 ? (
                <button>
                  <i className="las la-arrow-up"></i>
                </button>
              ) : null}
              {/* 
                Shitty Hack? Yes
                Works? Yes
              */}
              {this.props.index !== document.getElementsByClassName("length").length - 1 ? (
                <button>
                  <i className="las la-arrow-down"></i>
                </button>
              ) : null}
            </div>
          ) : null}
          <button onClick={() => this.props.togglePublishState(this.state.UUID, !this.state.isPublished)}>
            <i className={this.state.isPublished ? "lar la-eye" : "lar la-eye-slash"}></i>
          </button>
          <button onClick={() => this.enableEditor(this.state)}>
            <i className="las la-cog"></i>
          </button>
          <UserConsumer>
            {({ user }) => {
              if (user.privileges >= 2)
                return (
                  <button onClick={() => this.props.toggleDeleteDialog(this.state)}>
                    <i className="las la-trash"></i>
                  </button>
                )
            }}
          </UserConsumer>
        </div>
      </div>
    )
  }
}

export default AdminStoreItem
