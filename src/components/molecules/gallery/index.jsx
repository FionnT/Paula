import React, { Component } from "react"
import { Photoshoot, ChevronNavigation } from "../../atoms/"
import { Redirect } from "react-router-dom"

import "./styles.sass"

const photoshoots = {
  1: {
    title: "Cailín",
    url: "cailin",
    length: 7
  },
  2: {
    title: "DÁTH BEÍS",
    url: "dath-beis",
    length: 7
  },
  3: {
    title: "Diosco",
    url: "diosco",
    length: 8
  },
  4: {
    title: "Reibiliunach",
    url: "reibiliunach",
    length: 7
  },
  5: {
    title: "Ríoga",
    url: "rioga",
    length: 9
  },
  6: {
    title: "Tréighte",
    url: "treighte",
    length: 10
  },
  7: {
    title: "Mini Shoots",
    url: "mini-shoots",
    length: 18
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
      }, // current animation state
      chevronState: this.props.chevronState, // should chevron navigation display?
      shootCount: 7, // how many galleries to create
      rendered: undefined, // the update, processed galleries, i.e. if one should be open
      shoots: photoshoots,
      mobilestate: "" // adds 60px of padding to gallery on smaller devices
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

  renderShoots() {
    let result = []
    const { shoots } = this.state
    if (shoots) {
      for (let shoot in shoots) {
        shoots[shoot].index = shoot
        let photoshoot = <Photoshoot key={shoot} data={shoots[shoot]} onTrigger={this.handlePageNavigation} />
        result.push(photoshoot)
      }
      this.setState({ rendered: result })
    } else this.setState({ rendered: <Redirect to="/"></Redirect> })
  }

  handlePageNavigation(shootname) {
    const { shoots } = this.state

    // translates vertical scrolling into horizontal for desktop
    var element = document.scrollingElement || document.documentElement
    const transformScroll = event => {
      if (!event.deltaY) return
      event.currentTarget.scrollLeft += (event.deltaY + event.deltaX) * 10
      event.preventDefault()
    }

    if (shootname) {
      this.updateHistory(shootname)
      element.addEventListener("wheel", transformScroll, { passive: false })

      // prevents scrollbars from appearing according to device size
      if (window.innerWidth > 1200) {
        document.documentElement.style.overflow = "visible"
        document.body.style.overflow = "visible hidden"
      } else {
        document.documentElement.style.overflow = "visible hidden"
        document.body.style.overflow = "visible hidden"
      }

      // Parsing pretty URL from :param into the selected shoot
      for (let shoot in shoots) shoots[shoot].url === shootname ? (shoots[shoot].activated = "activated") : (shoots[shoot].activated = "hidden")

      // Setting disabled to true
      this.setState({ shoots: shoots, chevronState: "disabled", mobilestate: "opened" }, () => {
        this.renderShoots()
      })
    } else {
      this.updateHistory("/")
      element.removeEventListener("wheel", transformScroll)

      // prevents scrollbars from appearing according to device size
      if (window.innerWidth > 1200) {
        document.documentElement.style.overflow = "hidden"
        document.body.style.overflow = "hidden"
      } else {
        document.documentElement.style.overflow = "hidden visible"
        document.body.style.overflow = "hidden visible"
      }

      // determining what type of chevron to show, so we can preserve scroll height on return
      let chevronCalc = "full" // default
      if (this.state.animation.index === this.state.shootCount) chevronCalc = "uponly"
      else if (this.state.animation.index === 1) chevronCalc = "downonly"

      // disable all shoots on back navigation
      for (let shoot in shoots) shoots[shoot].activated = ""

      this.setState({ shoots: shoots, chevronState: chevronCalc, mobilestate: "" }, () => {
        this.renderShoots()
      })
    }
  }

  handleGalleryScroll(down) {
    const { animation } = this.state

    let newHeading // offset from top of page
    let newIndex // current gallery number, from 1
    let oldHeading = Number(animation.heading)

    if (down) {
      // i.e. we can't go any further down
      if (animation.index === this.state.shootCount - 1) this.setState({ chevronState: "uponly" })
      else this.setState({ chevronState: "full" })
      newHeading = oldHeading - 86
      newIndex = animation.index + 1
    } else {
      // i.e. we can't go any further up
      if (animation.index === 2) this.setState({ chevronState: "downonly" })
      else this.setState({ chevronState: "full" })
      newHeading = oldHeading + 86
      newIndex = animation.index - 1
    }

    let newAnimation = {
      index: newIndex,
      heading: newHeading,
      style: { marginTop: newHeading + "vh" } // react style prop takes a JSON object
    }
    this.setState({ animation: newAnimation })
  }

  render() {
    return (
      <div id="gallery" className={this.state.mobilestate}>
        <div id="animationbox" key={"animation helper"} style={this.state.animation.style}></div>
        {this.state.rendered}
        <ChevronNavigation handleGalleryScroll={this.handleGalleryScroll} chevronState={this.state.chevronState} />
      </div>
    )
  }
}

export default Gallery
