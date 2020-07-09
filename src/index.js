// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route } from "react-router-dom"

import { ProtectedRoute } from "./components/atoms"
import { UserProvider, CartProvider } from "./context-providers"

import * as pages from "./pages"
import "./styles/global.sass"

// import * as serviceWorker from './serviceWorker'

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <p id="notifier"> </p>
          <Switch>
            {/* General Routes */}
            <Route exact path="/" component={pages.Home} />
            <Route exact path="/about" component={pages.About} />
            <Route exact path="/contact" component={pages.Contact} />
            <Route path="/shoot/:shootname" component={pages.Home} />

            {/* Store Routes */}
            <Route exact path="/shop" component={pages.Shop.Store} />
            <Route exact path="/shop/review" component={pages.Shop.ReviewOrder} />
            <Route exact path="/shop/shipping" component={pages.Shop.Shipping} />
            <Route exact path="/shop/checkout" component={pages.Shop.Checkout} />
            <Route exact path="/shop/checkout/:orderid" component={pages.Shop.Checkout} />
            <Route exact path="/shop/thank-you" component={pages.Shop.ThankYou} />

            {/* Administration Routes */}
            <Route exact path="/admin/login" component={pages.Authentication} />
            <ProtectedRoute privileges="3" path="/admin/galleries" component={pages.Admin.GalleryControl}></ProtectedRoute>

            {/* Error Pages */}
            <Route exact path="/unauthorised" component={pages.Errors.Unauthorised} />
            <Route path="*" component={pages.Errors.NotFound} />
          </Switch>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))
