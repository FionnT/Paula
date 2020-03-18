// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import { About, Authentication, Checkout, Contact, Home, Shop } from "./pages"
import { UserProvider } from "./context-providers"
import "./styles/global.sass"

// import * as serviceWorker from './serviceWorker'

const App = () => {
  return (
    <UserProvider>
      <BrowserRouter>
        <p id="notifier"> </p>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route exact path="/admin/login" component={Authentication} />
          <Route path="/shop" component={Shop} />
          {/* <Route exact path="/shop/checkout" component={Checkout} /> */}
          <Route exact path="/shoot/">
            <Redirect to="/"></Redirect>
          </Route>
          <Route path="/shoot/:shootname" component={Home} />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
