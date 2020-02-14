import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './styles.sass'

const Navigation = () => {
	const [enabled, toggle] = useState('')
	const toggler = () => {
		const slideOut = () => {
			toggle('closed')
			setTimeout(() => {
				toggle('')
			}, 450)
		}
		enabled === 'opened' ? slideOut() : toggle('opened')
	}
	// const screenWidth = (window.innerWidth / 2) * -1
	// const positionAdjustment = {
	// 	marginLeft: screenWidth
	// }
	return (
		<nav className={enabled}>
			<Link
				to={{
					pathname: '/',
					state: { shootname: false, chevronState: 'downonly' } // clearing any selected shoots
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
	)
}

export default Navigation
