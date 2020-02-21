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

  const scrollArrow = enable => {
    let arrow = document.getElementById("mobileindicator")
    if (window.innerWidth < 1200 && document.location.pathname === "/") window.scrollY > 0 ? (arrow.style.display = "none") : (arrow.style.display = "block")
  }

  window.addEventListener("scroll", scrollArrow)
  const displayfix = document.location.href.pathname !== "/" ? { display: "none" } : null
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
            <Link to="/">Contact</Link>
          </li>
          <li>
            <Link to="/">Shop</Link>
          </li>
        </ul>
      </nav>
      <div id="mobileindicator" style={displayfix}>
        <i className="las la-long-arrow-alt-down"></i>
      </div>
    </div>
  )
}

export default Navigation
