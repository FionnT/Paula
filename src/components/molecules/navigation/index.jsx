import React, { useState } from "react"
import { Link } from "react-router-dom"
import "./styles.sass"

const Navigation = () => {
  const [enabled, toggle] = useState("")
  let gallery = document.getElementById("gallery")
  const toggler = () => {
    const slideOut = () => {
      toggle("opened")
      gallery.style.paddingTop = "36vh"
    }
    const slideIn = () => {
      gallery.style.paddingTop = "0vh"
      toggle("closed")
      setTimeout(() => {
        toggle("")
      }, 450)
    }
    enabled === "opened" ? slideIn() : slideOut()
  }
  const scrollArrow = enable => {
    let arrow = document.getElementById("#mobileindicator")
    window.scrollY > 0 ? (arrow.style.display = "none") : (arrow.style.display = "block")
  }

  window.addEventListener("scroll", scrollArrow)

  return (
    <React.Fragment>
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
              <Link to="/">About</Link>
            </li>
            <li>
              <Link to="/">Shop</Link>
            </li>
            <li>
              <Link to="/">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="#mobileindicator">
        <i className="las la-long-arrow-alt-down"></i>
      </div>
    </React.Fragment>
  )
}

export default Navigation
