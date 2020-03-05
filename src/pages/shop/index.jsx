import React from "react"
import { Navigation } from "../../components/molecules"
import "./styles.sass"

export default function Shop() {
  return (
    <>
      <Navigation />
      <div id="shop">
        <span>
          <i class="las la-exclamation-circle"></i>
        </span>
        <h1> Coming Soon! </h1>
      </div>
    </>
  )
}
