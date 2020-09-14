import React, { Component } from "react"
import { Link } from "react-router-dom"
import { UserConsumer, CartConsumer } from "../../../context-providers"
import { UserProfileButton, CartButton } from "../../molecules"
import "./styles.sass"

class Navigation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enabled: ""
    }
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

  componentDidMount() {
    window.addEventListener("scroll", this.handleMobileArrow, { passive: false, useCapture: true })
    const links = Array.from(document.getElementById("navigation").getElementsByTagName("a"))
    links.forEach(link => {
      const linkPath = link.attributes.href.value
      const currentPath = document.location.pathname
      if (currentPath.match(linkPath) && linkPath !== "/" && !currentPath.match("/admin")) link.style.color = "coral"
    })
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
            <CartConsumer>
              {methods => {
                if (
                  // Display in shop root, and only shop root
                  // Display outside the shop if we have items in cart, but not if we're already reviewing our order
                  (document.location.pathname.match("shop") && !document.location.pathname.match("/shop/") && !document.location.pathname.match("/admin")) ||
                  (methods.cart.items.length && !document.location.pathname.match("shop"))
                )
                  return (
                    <li className="cart">
                      <CartButton methods={methods} />
                    </li>
                  )
              }}
            </CartConsumer>
            <UserConsumer>
              {({ user, updateUser }) => {
                if (user.filename)
                  return (
                    <li className="profile">
                      <UserProfileButton user={user} updateUser={updateUser} />
                    </li>
                  )
              }}
            </UserConsumer>
          </ul>
        </nav>
      </div>
    )
  }
}

export default Navigation
