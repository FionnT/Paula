import React, { Component } from "react"
import { Link } from "react-router-dom"
import { UserConsumer, UserProvider } from "../../../context-providers"
import { UserProfile } from "../../atoms"
import "./styles.sass"

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: ""
    }
  }

  // only display the arrow on the homepage
  scrollArrow = () => {
    if (document.location.pathname === "/")
      return (
        <div id="mobileindicator">
          <i className="las la-angle-down"></i>
        </div>
      )
  }

  // toggle mobile navigation menu
  navigationToggler = () => {
    const item = document.getElementById("root").children[1]
    const slideOut = () => {
      this.setState({ enabled: "opened" })
      item.style.paddingTop = "36vh"
    }
    const slideIn = () => {
      item.style.paddingTop = "0vh"
      this.setState({ enabled: "closed" }, () => {
        setTimeout(() => {
          this.setState({ enabled: "" })
        }, 450)
      })
    }
    this.state.enabled === "opened" ? slideIn() : slideOut()
  }

  // handles mobile arrow visibility after scrolling
  scrollOfArrow = enable => {
    let arrow = document.getElementById("mobileindicator")
    if (window.innerWidth < 1200 && document.location.pathname === "/") document.body.scrollTop > 0 ? (arrow.style.display = "none") : (arrow.style.display = "block")
  }

  componentDidMount() {
    const links = Array.from(document.getElementById("navigation").getElementsByTagName("a"))
    links.forEach(link => {
      const linkPath = link.attributes.href.value
      const currentPath = document.location.pathname
      if (linkPath === currentPath && currentPath !== "/") link.style.color = "#FF7F50"
    })
    document.body.addEventListener("scroll", this.scrollOfArrow)
  }

  render() {
    return (
      <div id="navigation" className="wrapper">
        <nav className={this.state.enabled}>
          <Link
            to={{
              pathname: "/",
              state: { shootname: false, chevronState: "downonly" } // clearing any selected shoots
            }}
          >
            <h1>fnati.c</h1>
          </Link>
          <button className="mobile" aria-label="mobile menu activation button" onClick={this.navigationToggler}>
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
              <Link to="/shop">Shop</Link>
            </li>
          </ul>
          <UserProfile />
        </nav>
        {this.scrollArrow()}
      </div>
    )
  }
}

export default Navigation
