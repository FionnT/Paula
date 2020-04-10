import React from "react"
import "./styles.sass"

export default function Button(props) {
  const onClick = props.onSubmit?.bind(this)
  return (
    <button onClick={onClick} className={props.className} style={props.style ? props.style : {}}>
      {props.children}
    </button>
  )
}
