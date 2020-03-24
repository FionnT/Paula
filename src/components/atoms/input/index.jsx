import React, { Component } from "react"
import "./styles.sass"

// This was supposed to be a functional component
// However the logic for allowing user input, and prefilling an Input with a value at the same time
// Is rather annoying to do, & unreadable in Functional components
// Using the defaultValue field also won't work
// React will prefer any user input over an update to the prop

class Input extends Component {
  constructor(props) {
    super(props)
    this.textController = this.props?.textController?.bind(this)
    this.state = {
      value: this.props.value
    }
    this.userIsInputting = false
  }

  componentDidUpdate() {
    if (this.state.value !== this.props.value && !this.userIsInputting) this.setState({ value: this.props.value })
  }

  render() {
    const { type, placeholder } = this.props
    return (
      <div className={"inputField " + type}>
        <p>{placeholder}</p>
        {type !== "text" ? (
          <input
            onInput={this.textController}
            type={type}
            value={this.state.value}
            onChange={e => {
              this.userIsInputting = true
              this.setState({ value: e.target.value }, () => (this.userIsInputting = false))
            }}
          />
        ) : (
          <textarea type={type} onInput={this.textController}></textarea>
        )}
      </div>
    )
  }
}

export default Input
