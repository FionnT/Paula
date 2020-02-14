import React, { Component } from 'react'
import { Photoshoot, ChevronNavigation } from '../../atoms/'
import { Redirect } from 'react-router-dom'

import './styles.sass'

const photoshoots = {
	1: {
		title: 'DÁTH BEÍS',
		url: 'dath-beis',
		length: 12
	},
	2: {
		title: 'DÁTH BEÍS',
		url: 'dath-beis2',
		length: 12
	},
	3: {
		title: 'DÁTH BEÍS',
		url: 'dath-beis3',
		length: 12
	},
	4: {
		title: 'DÁTH BEÍS',
		url: 'dath-beis4',
		length: 12
	}
}

class Gallery extends Component {
	constructor(props) {
		super(props)
		this.handlePageNavigation = this.handlePageNavigation.bind(this)
		this.handleGalleryScroll = this.handleGalleryScroll.bind(this)
		this.updateHistory = this.props.updateHistory.bind(this)
		this.state = {
			animation: {
				heading: 0,
				index: 1,
				style: undefined
			},
			chevronState: this.props.chevronState,
			shootCount: 4,
			rendered: undefined,
			shoots: photoshoots
		}
	}

	componentDidMount() {
		if (this.props.shootname) this.handlePageNavigation(this.props.shootname)
		else this.handlePageNavigation()
	}

	componentDidUpdate(prevProps) {
		// If a user has entered a URL to a shoot, it will be passed down via props
		// Here we enable a singular shoot where selected, or enable all if the prop is empty
		if (this.props.shootname && prevProps.shootname !== this.props.shootname) this.handlePageNavigation(this.props.shootname)
		else if (!this.props.shootname && prevProps.shootname) this.handlePageNavigation()
		if (this.props.chevron && this.props.chevron !== this.state.chevron) this.setState({ chevron: this.props.chevron })
	}

	fetchAllShoots = () => {
		// set shootCount max to correct after fetching from backend -> currently hardcoded
	}

	handlePageNavigation(shootname) {
		const { shoots } = this.state
		if (shootname) {
			this.updateHistory(shootname)
			// Parsing pretty URL from :param into the selected shoot
			for (let shoot in shoots) if (shoots[shoot].url === shootname) shoots[shoot].activated = 'activated'
			// Setting disabled to true
			this.setState({ shoots: shoots, chevronState: 'disabled' }, () => {
				this.renderShoots()
			})
		} else {
			this.updateHistory('/')
			let chevronCalc = 'full'
			if (this.state.animation.index === this.state.shootCount) chevronCalc = 'uponly'
			else if (this.state.animation.index === 1) chevronCalc = 'downonly'
			for (let shoot in shoots) shoots[shoot].activated = ''
			this.setState({ shoots: shoots, chevronState: chevronCalc }, () => {
				this.renderShoots()
			})
		}
	}

	handleGalleryScroll(down) {
		const { animation } = this.state
		let newHeading
		let newIndex
		let oldHeading = Number(animation.heading)
		if (down) {
			if (animation.index === this.state.shootCount - 1) this.setState({ chevronState: 'uponly' })
			// disabled = true
			else this.setState({ chevronState: 'full' })
			newHeading = oldHeading - 86
			newIndex = animation.index + 1
		} else {
			if (animation.index === 2) this.setState({ chevronState: 'downonly' })
			else this.setState({ chevronState: 'full' })
			newIndex = animation.index - 1
			newHeading = oldHeading + 86
		}

		let newAnimation = {
			index: newIndex,
			heading: newHeading,
			style: { marginTop: newHeading + 'vh' }
		}
		this.setState({ animation: newAnimation })
	}

	renderShoots() {
		let result = []
		const { shoots } = this.state
		if (shoots) {
			for (let shoot in shoots) {
				shoots[shoot].index = shoot
				// eslint-disable-next-line eqeqeq
				let photoshoot = <Photoshoot key={shoot} data={shoots[shoot]} onTrigger={this.handlePageNavigation} />
				result.push(photoshoot)
			}
			this.setState({ rendered: result })
		} else this.setState({ rendered: <Redirect to="/"></Redirect> })
	}

	render() {
		return (
			<div id="gallery">
				<div id="animationbox" key={'animation helper'} style={this.state.animation.style}></div>
				{this.state.rendered}
				<ChevronNavigation handleGalleryScroll={this.handleGalleryScroll} chevronState={this.state.chevronState} />
			</div>
		)
	}
}

export default Gallery
