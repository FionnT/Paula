import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import ReactDOM from 'react-dom'
import { Home } from './components/organisms/index.js'

import './components/styles/global.sass'

// import * as serviceWorker from './serviceWorker'

const App = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={Home} />
				<Route exact path="/shoot/">
					<Redirect to="/"></Redirect>
				</Route>
				<Route path="/shoot/:shootname" component={Home} />
			</Switch>
		</BrowserRouter>
	)
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
