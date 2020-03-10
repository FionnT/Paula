import React from "react"
import "./styles.sass"

export default function Input(props) {
  const textController = props?.textController?.bind(this)
  const { type, placeholder } = props
  return (
    <div className={"inputField " + type}>
      <p>{placeholder}</p>
      {type !== "text" ? <input onInput={textController} type={type} /> : <textarea type={type} onInput={textController}></textarea>}
    </div>
  )
}
