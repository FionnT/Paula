// eslint-disable-file
import React, { Component } from "react"
import "./styles.sass"
import { isEdge, isMobile } from "react-device-detect"

class Photoshoot extends Component {
  constructor(props) {
    super(props)
    this.handlePageNavigation = this.props.handlePageNavigation.bind(this) // handles actual page/url navigation
    this.state = this.props.data
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

  handleActivate() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    const container = document.querySelectorAll("#" + this.state.url + " .photo-wrapper")[0]
    const galleryButton = document.querySelectorAll("#" + this.state.url + " .gallery-back")[0]

    galleryButton.style.display = "block"
    container.style.width = "auto"
    container.style.overflowX = "visible"

    images.forEach(image => {
      image.style.transform = ""
      image.style.opacity = "1"
      image.style.transition = "all 0.45s ease"
      image.style.marginLeft = "0px"
      image.style.marginRight = "20px"
      image.style.height = "85%"
    })
  }

  handleClosure() {
    // This will get triggered on galleries even if they've never been opened, due to the SPA logic
    // Therefore we are storing the original width of the item (this, is the unshrunken version)
    // We store this using onLoad() handler below
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    const galleryButton = document.querySelectorAll("#" + this.state.url + " .gallery-back")[0]

    galleryButton.style.display = "none"

    if (isEdge) {
      document.body.style.overflow = ""
      document.documentElement.style.overflowY = ""
    }
    images.forEach((image, index) => {
      image.style.transition = "all 0.25s linear"
      const width = parseInt(image.dataset.originalWidth)
      switch (index) {
        case 0:
          image.style.height = "100%"
          image.style.marginLeft = 600 - width / 2 + "px"
          image.style.marginRight = "0"
          return
        case 1:
          image.style.height = "100%"
          image.style.transform = "scale(0.92)"
          image.style.marginLeft = width * -1 + "px"
          image.style.marginRight = "0"
          return
        case 2:
          image.style.height = "100%"
          image.style.transform = "scale(0.82)"
          image.style.marginLeft = width * -1 + "px"
          image.style.marginRight = "0"
          return
        default:
          image.style.opacity = "0"
      }
    })
  }

  handleOnLoad(e) {
    if (this.state.activated !== "activated") {
      const styles = window.getComputedStyle(e.target)
      const index = parseInt(e.target.dataset.index)
      const { width } = styles
      switch (index) {
        case 0:
          e.target.style.marginLeft = 600 - parseInt(width) / 2 + "px"
          e.target.dataset.originalWidth = width
          return
        case 1:
          e.target.style.transform = "scale(0.92)"
          e.target.dataset.originalWidth = width
          e.target.style.marginLeft = parseInt(width) * -1 + "px"
          return
        case 2:
          e.target.style.transform = "scale(0.82)"
          e.target.dataset.originalWidth = width
          e.target.style.marginLeft = parseInt(width) * -1 + "px"
          return
        default:
          return
      }
    } else if (document.location.href.match(this.state.url)) {
      // They are shrunk to 85% when activated, we need to store their true width
      const styles = window.getComputedStyle(e.target)
      e.target.dataset.originalWidth = (parseInt(styles.width) / 85) * 100
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
          if (i >= 2) image.style.transform = `translatex(175px) scale(0.82)`
          if (i < 3) {
            // Applying shadows to visible items
            image.style.boxShadow = "#F3F3F3 3px 1px 14px"
            image.style.opacity = 1
          }
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
      const photoURL = "/galleries/" + this.state.url + "/" + itemOrder[i] + ".jpg"
      let photo = <img key={i} src={photoURL} alt="" data-index={i} onLoad={this.handleOnLoad.bind(this)} style={{ zIndex: length - i }} />
      result.push(photo)
    }
    let padding = <img src="../blank_1px.png" ref="img" alt="empty padding" key="padding" />
    result.push(padding)
    return result
  }

  render() {
    return (
      <div id={this.state.url} className={"photoshoot " + this.state.activated}>
        <h2>{this.state.title}</h2>
        <div
          className="photo-wrapper"
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
