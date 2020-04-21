import React, { Component } from "react"
import { CartItem } from "../../atoms"
import { Button } from "../../atoms"
import { Link } from "react-router-dom"
import { isMobile } from "react-device-detect"
class CartButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cartStatus: false,
      updateCart: this.props.methods.updateCart,
      cartItems: this.props.methods.cart.items
    }
  }

  handleCartDisplay = () => {
    if (isMobile) {
      document.location = "/shop/review"
      return
    }
    if (document.location.pathname.match("/shop") || this.state.cartItems.length) {
      if (this.state.cartStatus) document.getElementById("cart-container").style.display = "none"
      else document.getElementById("cart-container").style.display = "block"
      this.setState({ cartStatus: !this.state.cartStatus })
    }
  }

  componentDidUpdate() {
    let existingItems = this.state.cartItems
    let contextItems = this.props.methods.cart.items
    // We're already filtering duplicates in the CartProvider Element, so we can just use a naive check here
    if (contextItems.length !== existingItems.length) this.setState({ cartItems: contextItems })
    if (contextItems.length) document.getElementsByClassName("la-shopping-cart")[0].style.color = "coral"
    else document.getElementsByClassName("la-shopping-cart")[0].style.color = ""
  }

  componentDidMount() {
    if (this.props.methods.cart.items.length) document.getElementsByClassName("la-shopping-cart")[0].style.color = "coral"
    else document.getElementsByClassName("la-shopping-cart")[0].style.color = ""
  }

  emptyCart = (
    <div className="empty-cart" key="empty cart">
      <img src="/empty_cart.png" alt="Empty Cart" />
      <p>Your cart is empty! </p>
    </div>
  )

  handleCartItems = () => {
    const { cartItems, updateCart } = this.state
    let rendered = []
    if (cartItems.length) {
      cartItems.forEach((item, index) => {
        rendered.push(<CartItem {...item} updateCart={updateCart} keyValue={item.UUID + index} key={item.UUID + index} />)
        index !== cartItems.length - 1
          ? rendered.push(<div className="after" key={"after" + index}></div>)
          : rendered.push(
              <Link to="/shop/review" key="review order">
                <Button className="center cart-button" key="checkout-button" onClick={() => (document.location = "/shop/review")}>
                  Checkout
                </Button>
              </Link>
            )
      })
      return rendered
    } else return this.emptyCart
  }

  render() {
    return (
      <div>
        <span onClick={this.handleCartDisplay}>
          <i className="las la-shopping-cart"></i>
        </span>
        <div id="cart-container">
          <p>
            <i className="las la-square-full"></i>
          </p>
          <div id="cart-menu">{this.handleCartItems()}</div>
        </div>
      </div>
    )
  }
}

export default CartButton
