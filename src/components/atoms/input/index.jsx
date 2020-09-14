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
    this.textController = props.textController?.bind(this)
    this.onSubmit = props.onSubmit?.bind(this)
  }

  handleKeyDown = e => {
    if (e.key === "Enter" && this.onSubmit) this.onSubmit()
  }

  render() {
    const { className, immutable, immutableWidth, label, mutableWidth, name, placeholder, required, type, value } = this.props
    return (
      <div className={"inputField " + type + " " + className}>
        <p>{placeholder}</p>
        {label ? <label htmlFor={label}>{label}</label> : null}
        {immutable ? <input className="fixedValue" style={{ width: immutableWidth }} value={immutable} disabled /> : null}
        {type !== "text" ? (
          <input
            onChange={e => this.textController(e)}
            onKeyDown={e => this.handleKeyDown(e)}
            type={type}
            className={immutable ? "immutable " : ""}
            style={{ width: mutableWidth }}
            required={required ? true : false}
            value={value ? value : ""} // Don't do exist check here, as when emptying the element it won't overwrite
            name={name ? name : null}
          />
        ) : (
          <textarea type={type} onInput={e => this.props.textController(e)}></textarea>
        )}
      </div>
    )
  }
}

export default Input
