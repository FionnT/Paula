import React, { Component } from "react"
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

  togglePublish = () => {
    this.state.isPublished ? this.setState({ isPublished: false }) : this.setState({ isPublished: true })
  }

  render() {
    return (
      <div className="admin-store-item">
        <div className="item-image" style={this.state.backgroundImage} alt="Item"></div>
        <p>{this.state.name}</p>
        <div className="controls">
          <button onClick={this.togglePublish}>
            <i className={this.state.isPublished ? "lar la-eye" : "lar la-eye-slash"}></i>
          </button>
          <button onClick={() => this.enableEditor(this.state)}>
            <i className="las la-cog"></i>
          </button>
          <button>
            <i className="las la-trash"></i>
          </button>
        </div>
      </div>
    )
  }
}

export default AdminStoreItem
