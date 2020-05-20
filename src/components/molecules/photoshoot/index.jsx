// eslint-disable-file
import React, { Component } from "react"
import "./styles.sass"
import { isEdge, isFirefox, isMobile } from "react-device-detect"

class Photoshoot extends Component {
  constructor(props) {
    super(props)
    this.handlePageNavigation = this.props.handlePageNavigation.bind(this) // handles actual page/url navigation
    this.state = this.props.data
    this.state.forceRerender = "" // allows us to force a rerender, without needing to call this.forceUpdate() and causing an infinite loop
  }

  componentDidUpdate() {
    if (this.props && this.props.data.activated !== this.state.activated) this.setState({ activated: this.props.data.activated })
    if (this.props && this.props.scrolling !== this.state.scrolling) this.setState({ scrolling: this.props.scrolling })
    if (this.props.data.activated === "activated") this.handleActivate()
    else if (this.props.data.activated === "") this.handleClosure()
  }

  componentDidMount() {
    if (this.state.activated === "activated") this.handleActivate()
  }

  // TL:DR; Don't rewrite the below to calculate based on margins
  // All browsers handle grid layouts differently
  // Webkit assigns margins to center, but Firefox just positions them pseudo-absolutely
  // Edge just makes stuff up basically

  handleActivate() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    const photoWrapper = document.querySelectorAll("#" + this.state.url + " .photo-wrapper")[0]
    photoWrapper.style.overflowX = "visible"

    for (let i = 0; i < images.length; i++) {
      let image = images[i]
      let myOffset
      let myStyles = window.getComputedStyle(image) // returns rendered styles, not those spec'd in css
      let myWidth = parseInt(myStyles.width) * 0.8
      let prevOffset = parseInt(image.attributes.prevoffset) || undefined
      let prevWidth = parseInt(image.attributes.prevwidth) || undefined
      let windowWidth = window.innerWidth
      image.style.opacity = 1
      image.style.transition = "transform 0.5s ease"

      if (isEdge) {
        document.body.style.overflow = "visible"
        document.documentElement.style.overflowY = "hidden"
      }
      //
      // Yay responsiveness
      // Left offset for the first item is = (container width/2 * -1) + (item width/2) --- Images are moved from the center, not the edges
      // Each child tags the next image with it's current offset, and it's width
      // For images that are bigger, or smaller than the previous image +- 50, we need to do some additional computation
      // It's always going to be a fuzzy number here, we because need margins of error due to being responsive
      // Which is all to say I have no idea why the below works, except that it does work.
      //

      if (i === 0) {
        let bump = windowWidth > 1200 ? 0 : windowWidth > 800 ? 5 : windowWidth > 700 ? 0 : windowWidth > 425 ? 22 : window.innerHeight > 800 ? 40 : 0
        let containerWidth = parseInt(window.getComputedStyle(document.querySelector("#gallery")).width)
        myOffset = containerWidth / -2 + myWidth / 2 - bump
      } else if (myWidth - prevWidth > 50 || myWidth - prevWidth < -50) {
        if (windowWidth > 1200) {
          let bumpForLargeImage = isFirefox ? -10 : isEdge ? -5 : window.innerHeight > 990 ? -15 : 15
          let bumpForSmallerImage = isFirefox ? 0 : isEdge ? 0 : window.innerHeight > 990 ? 10 : -20
          myWidth > prevWidth ? (myOffset = prevWidth / 2 + myWidth / 2 + prevOffset + bumpForLargeImage) : (myOffset = prevOffset - myWidth / 2 + prevWidth + bumpForSmallerImage)
        } else if (windowWidth < 1200 && windowWidth > 1050) {
          // iPad Pro, landscape, or other large'ish device
          myWidth > prevWidth ? (myOffset = prevWidth + myWidth / 3 + prevOffset - 20) : (myOffset = prevOffset + myWidth * 0.6 + prevWidth / 2 - 10)
        } else if (windowWidth < 1050 && windowWidth > 810) {
          // Normal iPad or other tablets
          myWidth > prevWidth ? (myOffset = prevWidth / 3 + myWidth / 3 + prevOffset + 15) : (myOffset = prevOffset + myWidth + prevWidth * 0.6 - 60)
        } else if (windowWidth < 810 && windowWidth > 500) {
          // landscape phone, or medium portrait tablets
          myWidth > prevWidth ? (myOffset = prevWidth + myWidth / 10 + prevOffset - 40) : (myOffset = prevOffset + myWidth * 1.1 + prevWidth / 2 + 15)
        } else if (windowWidth < 500) {
          // mobile phones in general
          myWidth > prevWidth ? (myOffset = prevOffset + myWidth / 2 - prevWidth / 3 + 40) : (myOffset = prevOffset + myWidth / 3 + prevWidth - 25)
        }
      } else myOffset = prevOffset + 20 + myWidth

      // passing information to the next image
      if (i < images.length - 1) {
        images[i + 1].attributes.prevoffset = myOffset
        images[i + 1].attributes.prevwidth = myWidth
      }

      image.style.transform = `translatex(${myOffset + "px"}) translatey(${parseInt(myStyles.height) * -0.1 + "px"}) scale(0.8)`
    }

    setTimeout(() => {
      // When loading a gallery via a direct link, the scripts above and from the Gallery component sometimes complete before the images have loaded
      // We therefore need to force a rerender after at least a partial load of those images, so that their _computed_ styles are correct
      this.setState({ forceRerender: true })
    }, 500)
  }

  handleClosure() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    if (isEdge) {
      document.body.style.overflow = ""
      document.documentElement.style.overflowY = ""
    }
    for (let i in images) {
      let image = images[i]
      image.style.transition = "all .35s ease"
      image.style.transform = ""
      // eslint-disable-next-line eqeqeq
      if (i == 1 || i == 2) image.style.transform = "scale(0.9)"
    }
  }

  handleHover(enable) {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    // eslint-disable-next-line eqeqeq
    const GalleryIsInMotion = document.getElementById("animationbox").dataset.motion == "true"
    if (this.state.activated !== "activated" && !GalleryIsInMotion) {
      if (enable) {
        for (let i = 0; i < images.length - 1; i++) {
          let image = images[i]
          // Element 0 is not manipulated
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
          // eslint-disable-next-line eqeqeq
          if (image == 1 || image == 2) images[image].style.transform = "scale(0.9)"
        }
      }
    }
  }

  handleRender() {
    const { itemOrder } = this.state
    const { length } = itemOrder // Ain't that neat?
    const maxAllowableLoad = this.props.data.activated === "activated" ? length : isMobile ? 1 : 3
    let result = []
    for (let i = 0; i < maxAllowableLoad; i++) {
      const divStyle = { zIndex: length - i }
      const photoURL = "/galleries/" + this.state.url + "/" + itemOrder[i] + ".jpg"
      let photo = <img key={i} className={"image-" + i} src={photoURL} alt="" style={divStyle} />
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
          onMouseMove={() => this.handleHover(true)} // Handle moving mouse after scrolling
          onMouseLeave={() => this.handleHover()}
          onMouseDown={() => this.handlePageNavigation(this.state.url)}
        >
          {this.handleRender()}
        </div>
        <div className="gallery-back">
          <p onClick={() => this.handlePageNavigation(false)}>Go Back</p>
          <span></span>
        </div>
      </div>
    )
  }
}

export default Photoshoot
