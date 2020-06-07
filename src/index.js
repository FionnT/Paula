// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import { About, Authentication, Checkout, Contact, GalleriesAdmin, Home, NotFound, Shipping, Store, ReviewOrder } from "./pages"
import { ProtectedRoute } from "./components/atoms"
import { UserProvider, CartProvider } from "./context-providers"
import "./styles/global.sass"

// import * as serviceWorker from './serviceWorker'

const App = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <CartProvider>
          <p id="notifier"> </p>
          <Switch>
            {/* User Facing Routes */}
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={Contact} />
            <Route path="/shoot/:shootname" component={Home} />
            <Route exact path="/shop" component={Store} />
            <Route exact path="/shop/review" component={ReviewOrder} />
            <Route exact path="/shop/shipping" component={Shipping} />
            <Route exact path="/shop/checkout" component={Checkout} />

            {/* Administration Routes */}
            <Route exact path="/admin/login" component={Authentication} />
            <ProtectedRoute privileges="3" path="/admin/galleries" component={GalleriesAdmin}></ProtectedRoute>

            {/* Error Pages */}
            <Route path="*" component={NotFound} />
          </Switch>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
