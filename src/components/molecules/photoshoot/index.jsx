// eslint-disable-file
import React, { Component } from "react"
import { isEdge, isMobile, isIOS13, isIPad13, isIPhone13, isIPod13 } from "react-device-detect"
import clickdrag from "react-clickdrag"
import "./styles.sass"

let maxUnopenedWidth

class Dragger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastPositionX: 0,
      currentX: 0,
      isGrabbing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // Changing directions mid-drag won't work. This is fine.
    const movingGalleryToTheLeft = nextProps.dataDrag.moveDeltaX <= 0 ? true : false
    const newPosition = this.state.currentX + nextProps.dataDrag.moveDeltaX
    const newCoordinates = Math.round(newPosition * -1) // Why 2300? You tell me
    if (movingGalleryToTheLeft) {
      if (nextProps.dataDrag.isMoving) {
        this.setState({ lastPositionX: this.state.currentX, currentX: newPosition })
        document.body.scrollLeft += newCoordinates
      }
    } else if (!movingGalleryToTheLeft) {
      if (nextProps.dataDrag.isMoving) {
        this.setState({ currentX: newPosition, lastPositionX: this.state.currentX })
        document.body.scrollLeft += newCoordinates * -1
      }
    }
  }

  render() {
    return (
      <div
        id="drag-handler"
        onMouseDown={() => this.setState({ className: "is-grabbing" })}
        onMouseUp={() => this.setState({ className: "" })}
        className={this.state.className}
      ></div>
    )
  }
}

const DragWrapper = clickdrag(Dragger, { touch: true })

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
    else if (this.props.data.activated === "") {
      this.handleClosure()
    }

    // Fix for slower internet speeds, feel free to adjust
    setTimeout(() => {
      if (this.state.activated !== "activated") this.handleClosure()
    }, 2000)
  }

  componentDidMount() {
    if (this.state.activated === "activated") this.handleActivate()
  }

  isNotDesktop() {
    if (isMobile || isIOS13 || isIPad13 || isIPhone13 || isIPod13) return true
    else return false
  }

  handleActivate() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    const container = document.querySelectorAll("#" + this.state.url + " .photo-wrapper")[0]
    const galleryButton = document.querySelectorAll("#" + this.state.url + " .gallery-back")[0]
    galleryButton.style.display = "block"

    container.style.pointerEvents = "none"

    images.forEach((image, index) => {
      image.style.opacity = "1"
      image.style.boxShadow = "none"
      image.style.transition = "all 0.35s cubic-bezier(0, 0, 0, 1.07) 0s"
      image.style.marginTop = "0"
      image.style.marginLeft = "0px"
      image.style.marginRight = "20px"
      image.style.height = "85%"
      image.style.width = "auto"
      image.style.transform = ""
      if (index >= 3 && index !== images.length - 1) image.src = image.dataset.trueSrc
    })
  }

  handleClosure() {
    let containerWidth
    const container = document.querySelectorAll("#" + this.state.url + " .photo-wrapper")[0]

    // skip processing unmounted elements
    if (container) containerWidth = parseInt(window.getComputedStyle(container).width) / 2
    else return

    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    const galleryButton = document.querySelectorAll("#" + this.state.url + " .gallery-back")[0]

    galleryButton.style.display = "none"
    container.style.pointerEvents = "auto"

    if (isEdge) {
      document.body.style.overflow = ""
      document.documentElement.style.overflowY = ""
    }

    images.forEach((image, index) => {
      image.style.transition = "all 0.25s ease"

      if (window.innerWidth <= 900) image.style.width = "max-content"
      switch (index) {
        case 0:
          image.style.height = "100%"
          image.style.marginLeft = containerWidth - maxUnopenedWidth / 2 + "px"
          image.style.marginRight = "0"
          return
        case 1:
          image.style.height = "92%"
          image.style.width = maxUnopenedWidth + "px"
          image.style.marginLeft = maxUnopenedWidth * -1 + "px"
          image.style.marginTop = "2.5%" // Ye I dunno either, should be 4%
          image.style.marginRight = "0"
          return
        default:
          image.style.marginTop = "5%" // Mmm, should be 7.5%
          image.style.width = maxUnopenedWidth + "px"
          image.style.height = "85%"
          image.style.marginLeft = maxUnopenedWidth * -1 + "px"
          image.style.marginRight = "0"
          image.style.opacity = "0"
      }
      if (index === 2) image.style.opacity = 1
    })
  }

  handleHover(enable) {
    if (!this.isNotDesktop()) {
      const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
      // eslint-disable-next-line eqeqeq
      const GalleryIsInMotion = document.getElementById("animationbox").dataset.motion == "true"

      if (this.state.activated !== "activated" && !GalleryIsInMotion) {
        if (enable) {
          images[1].style.transform = "translatex(85px)"
          images[2].style.transform = "translatex(175px)"
        } else {
          for (let image in images) {
            images[image].style.boxShadow = "none"
            images[image].style.transform = "unset"
          }
        }
      }
    }
  }

  handleOnLoad(e) {
    const container = document.querySelectorAll("#" + this.state.url + " .photo-wrapper")[0]
    const containerWidth = parseInt(window.getComputedStyle(container).width) / 2
    const realWidth = parseInt(e.target.naturalWidth)
    const styles = window.getComputedStyle(e.target)
    const index = parseInt(e.target.dataset.index)
    let renderWidth = parseInt(styles.width)
    let effectiveWidth = renderWidth > realWidth ? realWidth : renderWidth

    if (this.state.activated !== "activated" && !isMobile) {
      if (index === 0) {
        maxUnopenedWidth = effectiveWidth * 0.9
        e.target.dataset.effectiveWidth = effectiveWidth
        e.target.style.marginLeft = containerWidth - effectiveWidth / 2 + "px"
      } else {
        e.target.style.width = maxUnopenedWidth + "px"
        e.target.style.marginLeft = maxUnopenedWidth * -1 + -2 + "px" // Add -2 px to margin to ensure no overflowing of wide images
      }
    } else if (document.location.href.match(this.state.url)) {
      if (index === 0) {
        renderWidth = (parseInt(styles.width) / 85) * 100
        maxUnopenedWidth = effectiveWidth * 0.9
      }
    }
  }

  handleRender() {
    const { itemOrder } = this.state
    const { length } = itemOrder // Ain't that neat?

    const maxAllowableLoad = () => {
      if (this.state.activated === "activated") return length
      else if (this.isNotDesktop()) return 1
      else return length
    } // Fucking iOS
    let result = []
    for (let i = 0; i < maxAllowableLoad(); i++) {
      const photoURL = "/galleries/" + this.state.url + "/" + itemOrder[i]
      const src = i < 3 ? photoURL : "/blank_placeholder.png"
      let photo = <img key={i} src={src} alt="" data-index={i} data-true-src={photoURL} onLoad={this.handleOnLoad.bind(this)} style={{ zIndex: length - i }} />
      result.push(photo)
    }
    let padding = <img src="../blank_1px.png" ref="img" alt="empty padding" key="padding" />
    result.push(padding)
    return result
  }

  render() {
    return (
      <>
        {this.state.activated ? <DragWrapper /> : null}
        <div id={this.state.url} className={"photoshoot " + this.state.activated} ref>
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
      </>
    )
  }
}

export default Photoshoot
