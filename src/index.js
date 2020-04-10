// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import { About, Authentication, Contact, GalleriesAdmin, Home, Store, ReviewOrder } from "./pages"
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
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route exact path="/admin/login" component={Authentication} />
            <Route exact path="/shop" component={Store} />
            <Route exact path="/shop/review" component={ReviewOrder} />
            <Route exact path="/shoot/">
              <Redirect to="/"></Redirect>
            </Route>
            <Route path="/shoot/:shootname" component={Home} />
            <ProtectedRoute privilege="3">
              <Route exact path="/admin/galleries" component={GalleriesAdmin}></Route>
            </ProtectedRoute>
          </Switch>
        </CartProvider>
      </UserProvider>
    </BrowserRouter>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
