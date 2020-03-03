import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./styles.sass"

const Navigation = () => {
  const [enabled, toggle] = useState("")

  const toggler = () => {
    const item = document.getElementById("root").children[1]
    const slideOut = () => {
      toggle("opened")
      item.style.paddingTop = "36vh"
    }
    const slideIn = () => {
      item.style.paddingTop = "0vh"
      toggle("closed")
      setTimeout(() => {
        toggle("")
      }, 450)
    }
    enabled === "opened" ? slideIn() : slideOut()
  }

  const scrollArrow = () => {
    if (document.location.pathname === "/")
      return (
        <div id="mobileindicator">
          <i className="las la-angle-down"></i>
        </div>
      )
  }
  const scrollOfArrow = enable => {
    let arrow = document.getElementById("mobileindicator")
    if (window.innerWidth < 1200 && document.location.pathname === "/")
      document.body.scrollTop > 0 ? (arrow.style.display = "none") : (arrow.style.display = "block")
  }
  // if (document.location.pathname !== "/") document.getElementById("mobileindicator").style.display = "none"
  document.body.addEventListener("scroll", scrollOfArrow)
  return (
    <div className="wrapper">
      <nav className={enabled}>
        <Link
          to={{
            pathname: "/",
            state: { shootname: false, chevronState: "downonly" } // clearing any selected shoots
          }}
        >
          <h1>fnati.c</h1>
        </Link>
        <button className="mobile" aria-label="mobile menu activation button" onClick={toggler}>
          <div></div>
          <div></div>
        </button>
        <ul>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/">Shop</Link>
          </li>
        </ul>
      </nav>
      {scrollArrow()}
    </div>
  )
}

export default Navigation
