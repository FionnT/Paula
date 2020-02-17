import React, { Component } from "react"
import "./styles.sass"

class Photoshoot extends Component {
  constructor(props) {
    super(props)
    this.onTrigger = this.props.onTrigger.bind(this) // handles actual page navigation
    this.state = this.props.data
    this.state.animationClass = ""
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

      // Left offset for the first item is = the negative of the existing natural left margin + the change in our width/2 due to downscaling (10% of initial width)
      // 1st child adds a tag called 'offset' to the 2nd child eq to 1st childs width + a margin
      // 2nd child onwards tags n+1 with it's offset + width = correct offset from left for positioning where the images are the same size.
      // For images that are bigger, or smaller than the previous image +- 20, we need to do some additional computation

      if (i === 0) myOffset = (parseInt(myStyles.marginLeft) + myWidth / 8) * -1
      else if ((myWidth - prevWidth > 10 && prevWidth) || (myWidth - prevWidth < -10 && prevWidth)) {
        // I don't know why 25 fits better here, but it does - probably margins of error
        myWidth > prevWidth ? (myOffset = prevOffset + myWidth - prevWidth / 2 - 25) : (myOffset = prevOffset - myWidth / 2 + prevWidth - 25)
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
      this.setState({ animationClass: "" })
    }, 350)
  }

  handleClosure() {
    const images = Array.from(document.querySelectorAll("#" + this.state.url + " .photo-wrapper img")) // returns a nodelist != array
    for (let i = 0; i < images.length - 1; i++) {
      let image = images[i]
      image.style.transition = "all .35s ease"
      image.style.transform = "none"
    }
  }

  handleRender() {
    const length = this.state.length
    let result = []
    for (let i = 0; i < length; i++) {
      const divStyle = {
        zIndex: length - i
      }
      let photo
      if (i === 0) photo = <img key={i} className={"image-" + i} src={"../galleries/" + this.state.url + "/cover.jpg"} alt="" style={divStyle} />
      else photo = <img key={i} className={"image-" + i} src={"../galleries/" + this.state.url + "/" + i + ".jpg"} alt="" style={divStyle} />
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
          className={"photo-wrapper " + this.state.animationClass}
          onMouseOver={() => this.handleHover(true)}
          onMouseLeave={() => this.handleHover(false)}
          onMouseDown={() => this.onTrigger(this.state.url)}
        >
          {this.handleRender()}
        </div>
      </div>
    )
  }
}

export default Photoshoot
