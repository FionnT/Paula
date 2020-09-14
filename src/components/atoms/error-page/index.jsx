import React from "react"
import { Link } from "react-router-dom"
import "./styles.sass"

export default function ErrorPage(props) {
  return (
    <div id="error-page">
      <img src="/sad-panda.png" alt="A very sad panda. We're sorry." />
      <h2>{props.children}</h2>
      <Link to="/">Click here to go home. </Link>
    </div>
  )
}
