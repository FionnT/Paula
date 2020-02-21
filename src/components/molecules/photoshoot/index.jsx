import React, { Component } from "react"
import "./styles.sass"

class Photoshoot extends Component {
  constructor(props) {
    super(props)
    this.onTrigger = this.props.onTrigger.bind(this) // handles actual page navigation
    this.state = this.props.data
    this.state.forceRerender = "" // allows us to force a rerender, without needing to call this.forceUpdate()
  }

  componentDidUpdate() {
    if (this.props && this.props.data.activated !== this.state.activated) this.setState({ activated: this.props.data.activated })
    if (this.props.data.activated === "activated") this.handleActivate()
    else if (this.props.data.activated === "") this.handleClosure()
  }

  handleHover(enable) {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    if (this.state.activated !== "activated") {
      if (enable) {
        for (let i = 0; i < images.length - 1; i++) {
          let image = images[i]
          // We don't move the first element at all
          if (i === 1) image.style.transform = `translatex(85px) scale(0.92)`
          if (i >= 2) image.style.transform = `translatex(175px) scale(0.84)`
          if (i < 3) {
            // Applying shadows to visible items
            image.style.boxShadow = "#F3F3F3 3px 1px 14px"
            image.style.opacity = 1
          } else if (i >= 3) image.style.opacity = 0
        }
      } else {
        for (let image in images) {
          images[image].style.boxShadow = "none"
          images[image].style.transform = "unset"
        }
      }
    }
  }

  handleActivate() {
    //
    // Firefox and Webkit handle grid layouts differently
    // Webkit assigns margins to center, but Firefox just positions them pseudo-absolutely
    // Don't rewrite to calculate based on margins
    // Left offset for the first item is = (container width/2 * -1) + (item width/2)
    // Each child tags the next image with it's current offset, and it's width
    // For images that are bigger, or smaller than the previous image +- 20, we need to do some additional computation
    //
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array

    for (let i = 0; i < images.length; i++) {
      let myOffset
      let image = images[i]
      let myStyles = window.getComputedStyle(image) // returns rendered styles, not those spec'd in css
      let myWidth = parseInt(myStyles.width) * 0.8
      let prevOffset = parseInt(image.attributes.prevoffset) || undefined
      let prevWidth = parseInt(image.attributes.prevwidth) || undefined
      image.style.opacity = 1
      image.style.transition = "transform 0.5s ease"
      if (i === 0) {
        let containerWidth = parseInt(window.getComputedStyle(document.querySelector("#gallery")).width)
        let bump = window.innerWidth > 1200 ? 0 : 25
        myOffset = containerWidth / -2 + myWidth / 2 - bump
      } else if (myWidth - prevWidth > 50 || myWidth - prevWidth < -50) {
        // yay responsiveness
        if (window.innerWidth > 1200) {
          myWidth > prevWidth ? (myOffset = prevWidth / 2 + myWidth / 2 + prevOffset + 20) : (myOffset = prevOffset - myWidth / 2 + prevWidth - 25)
        } else if (window.innerWidth < 1200 && window.innerWidth > 500) {
          myWidth > prevWidth ? (myOffset = prevWidth + myWidth / 3 + prevOffset - 20) : (myOffset = prevOffset + myWidth * 0.6 + prevWidth / 2 - 10)
        } else if (window.innerWidth < 500) {
          myWidth > prevWidth ? (myOffset = prevOffset + myWidth / 2 - prevWidth / 3 + 40) : (myOffset = prevOffset + myWidth / 3 + prevWidth - 25)
        }
      } else myOffset = prevOffset + 20 + myWidth

      // passing information to the next image
      if (i < images.length - 1) {
        images[i + 1].attributes.prevoffset = myOffset
        images[i + 1].attributes.prevwidth = parseInt(myStyles.width) * 0.8
      }
      // applying new styles
      image.style.transform = `translatex(${myOffset + "px"}) translatey(${parseInt(myStyles.height) * -0.1 + "px"}) scale(0.8)`
    }

    setTimeout(() => {
      // When loading a gallery via a direct link, the scripts above and from the Gallery component complete before the images have loaded
      // We therefore need to force a rerender after at least a partial load of those images, so that there computed styles are correct
      this.setState({ forceRerender: true })
    }, 500)
  }

  handleClosure() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    for (let i in images) {
      let image = images[i]
      image.style.transition = "all .35s ease"
      image.style.transform = "none"
    }
  }

  handleFullPhoto = url => {
    if (this.state.activated === "activated") window.open(url, "_blank")
  }

  handleRender() {
    const { length } = this.state
    let result = []
    for (let i = 0; i < length; i++) {
      const divStyle = { zIndex: length - i }
      const photoURL = i === 0 ? "../galleries/" + this.state.url + "/cover.jpg" : "../galleries/" + this.state.url + "/" + i + ".jpg"
      const fullURL = i === 0 ? "../galleries/" + this.state.url + "/full/cover.jpg" : "../galleries/" + this.state.url + "/full/" + i + ".jpg"
      let photo = <img key={i} className={"image-" + i} src={photoURL} alt="" onClick={() => this.handleFullPhoto(fullURL)} style={divStyle} />
      result.push(photo)
    }
    let padding = <img src="../blank_1px.png" alt="empty padding" key="padding" />
    result.push(padding)
    return result
  }

  render() {
    return (
      <div id={this.state.url} className={"photoshoot " + this.state.activated}>
        <h2>{this.state.title}</h2>
        <div
          className={"photo-wrapper"}
          onMouseOver={() => this.handleHover(true)}
          onMouseLeave={() => this.handleHover()}
          onMouseDown={() => this.onTrigger(this.state.url)}
        >
          {this.handleRender()}
        </div>
      </div>
    )
  }
}

export default Photoshoot
