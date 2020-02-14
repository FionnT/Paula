import React, { Component } from 'react'
import './styles.sass'

class Photoshoot extends Component {
	constructor(props) {
		super(props)
		this.handleHover = this.handleHover.bind(this)
		this.onTrigger = this.props.onTrigger.bind(this)
		this.handleActivate = this.handleActivate.bind(this)
		this.state = this.props.data
		this.state.animationClass = ''
	}

	handleHover(enable) {
		const images = Array.from(document.querySelectorAll('#' + this.state.url + ' .photo-wrapper img')) // returns a nodelist != array
		if (this.state.activated !== 'activated') {
			if (enable) {
				for (let i = 0; i < images.length - 1; i++) {
					let image = images[i]
					// first element doesn't change at all
					if (i === 1) image.style.transform = `translatex(85px) scale(0.92)`
					if (i >= 2) image.style.transform = `translatex(175px) scale(0.84)`
					if (i < 3) {
						image.style.boxShadow = '#F3F3F3 3px 1px 14px'
						image.style.opacity = 1
					} else if (i >= 3) image.style.opacity = 0
				}
			} else {
				for (let image in images) {
					images[image].style.boxShadow = 'none'
					images[image].style.transform = 'unset'
				}
			}
		}
	}

	handleActivate() {
		const images = Array.from(document.querySelectorAll('#' + this.state.url + ' .photo-wrapper img')) // returns a nodelist != array
		// 1st child adds a tag called 'offset' to the 2nd child eq to 1st childs width + a margin
		// 2nd child onwards tags n+1 with it's offset + width + margin = correct offset from left for positioning
		for (let i = 0; i < images.length; i++) {
			let image = images[i]
			let myStyles = window.getComputedStyle(image) // returns rendered styles, not those spec'd in css
			image.style.opacity = 1
			image.style.transition = 'transform 0.5s ease'
			// width of container varies, and we need to offset by the negative of that for the first element,
			// the width of images may also vary, so we need to render all of these states dynamically
			// we're also scaling the elements down to 0.8 to load extra content below the images
			let myOffset = i !== 0 ? parseInt(image.attributes.offset) : (parseInt(myStyles.marginLeft) + parseInt(myStyles.width) * 0.1) * -1
			let nextOffset = myOffset + parseInt(myStyles.width) * 0.8 + 20
			if (i < images.length - 1) images[i + 1].attributes.offset = nextOffset
			image.style.transform = `translatex(${myOffset + 'px'}) translatey(${parseInt(myStyles.width) * -0.13 + 'px'}) scale(0.8)`
		}
		setTimeout(() => {
			this.setState({ animationClass: '' })
		}, 350)
	}

	handleClosure() {
		const images = Array.from(document.querySelectorAll('#' + this.state.url + ' .photo-wrapper img')) // returns a nodelist != array
		for (let i = 0; i < images.length - 1; i++) {
			let image = images[i]
			image.style.transition = 'all .35s ease'
			image.style.transform = 'none'
		}
	}

	componentDidUpdate() {
		if (this.props && this.props.data.activated !== this.state.activated) this.setState({ activated: this.props.data.activated })
		if (this.props.data.activated === 'activated') this.handleActivate()
		else if (this.props.data.activated === '') this.handleClosure()
	}

	handleRender() {
		const length = this.state.length
		let result = []
		for (let i = 0; i < length; i++) {
			const divStyle = {
				zIndex: length - i
			}
			let photo = <img key={i} className={'image-' + i} src="../placeholder.png" alt="" style={divStyle} />
			result.push(photo)
		}
		let padding = <img src="../blank_1px.png" alt="empty padding" key="padding" />
		result.push(padding)
		return result
	}

	render() {
		return (
			<div id={this.state.url} className={'photoshoot ' + this.state.activated}>
				<h2>{this.state.title}</h2>
				<div className={'photo-wrapper ' + this.state.animationClass} onMouseOver={() => this.handleHover(true)} onMouseLeave={() => this.handleHover(false)} onMouseDown={() => this.onTrigger(this.state.url)}>
					{this.handleRender()}
				</div>
			</div>
		)
	}
}

export default Photoshoot
