import React, { Component } from "react"
import { ChevronNavigation } from "../../atoms"
import { Photoshoot } from "../../molecules"
import { Redirect } from "react-router-dom"
import { isMobile, isFirefox } from "react-device-detect"
import "./styles.sass"

class Gallery extends Component {
  constructor(props) {
    super(props)
    this.handleGalleryScroll = this.handleGalleryScroll.bind(this)
    this.handleScrollAbility = this.handleScrollAbility.bind(this)
    this.handlePageNavigation = this.handlePageNavigation.bind(this)
    this.updateHistory = this.props.updateHistory.bind(this)
    this.state = {
      animation: {
        // current animation state
        heading: 0,
        index: 1,
        style: undefined
      },
      chevronState: this.props.chevronState, // should chevron navigation display?
      shootCount: undefined, // how many galleries to create
      rendered: undefined, // the updated, processed galleries, i.e. if one should be open
      shoots: undefined,
      mobilestate: "", // adds padding to gallery on smaller devices
      scrolling: false,
      forceRerender: false
    }
  }

  componentDidMount() {
    let element = document.scrollingElement || document.documentElement
    element.addEventListener("wheel", this.handleScrollWheel, { passive: false })
    this.fetchAllShoots().then(shoots => {
      this.setState({ shoots, shootCount: shoots.length }, () => {
        if (this.props.shootname) this.handlePageNavigation(this.props.shootname)
        else this.handlePageNavigation()
      })
    })
  }

  componentDidUpdate(prevProps) {
    // If a user has entered a URL to a shoot, it will be passed down via props
    // Here we enable a singular shoot where selected, or enable all if the prop is empty
    if (this.props.shootname && prevProps.shootname !== this.props.shootname) this.handlePageNavigation(this.props.shootname)
    else if (!this.props.shootname && prevProps.shootname) this.handlePageNavigation()
    if (this.props.chevron && this.props.chevron !== this.state.chevron) this.setState({ chevron: this.props.chevron })
  }

  fetchAllShoots = () => {
    if (!this.state.shoots) {
      return new Promise(resolve => {
        let server = process.env.REACT_APP_API_URL + "/photoshoots/home"
        fetch(server, { credentials: "include", mode: "cors" }).then(res => resolve(res.json()))
      })
    } else return
  }

  handleGalleryScroll(down) {
    const { animation } = this.state

    let newHeading // offset from top of page
    let newIndex // current gallery number, from 1
    let oldHeading = parseInt(animation.heading)
    let scrollable = false
    if (down && animation.index !== this.state.shootCount) {
      scrollable = true
      // i.e. we can't go any further down after this move
      if (animation.index === this.state.shootCount - 1) this.setState({ chevronState: "uponly" })
      else this.setState({ chevronState: "full" })
      newHeading = oldHeading - 86
      newIndex = animation.index + 1
    } else if (animation.index !== 1) {
      scrollable = true
      // i.e. we can't go any further up after this move
      if (animation.index === 2) this.setState({ chevronState: "downonly" })
      else this.setState({ chevronState: "full" })
      newHeading = oldHeading + 86
      newIndex = animation.index - 1
    }

    let newAnimation = {
      index: newIndex,
      heading: newHeading,
      style: { marginTop: newHeading + "vh" }
    }
    if (scrollable) this.setState({ animation: newAnimation })
  }

  // handling of shoot page open/close
  handlePageNavigation(shootname) {
    const { shoots } = this.state
    if (shootname) {
      this.updateHistory(shootname)
      this.handleScrollAbility(true)
      if (document.getElementById("mobileindicator")) document.getElementById("mobileindicator").style.display = "none"
      let shootIndex
      // Parsing pretty URL from :param into the selected shoot
      if (shoots) {
        for (let shoot = 0; shoot < shoots.length; shoot++) {
          if (shoots[shoot].url === shootname) {
            shootIndex = shoot
            const photoshoot = shoots[shoot]
            photoshoot.activated = "activated"
            // fix for mobile devices entering a gallery mid scroll - Navigation is 14vh
            // iOS Safari ignores this
            let offset = window.innerHeight * 0.86 * (shoot - 1)
            if (window.innerWidth < 1200) {
              document.documentElement.scrollTo(0, offset)
              document.body.scrollTo(0, offset)
            } else {
              const margin = (photoshoot.isInHomePosition - 1) * -86 + "vh"
              document.getElementById("animationbox").style.marginTop = margin
            }
          } else shoots[shoot].activated = "hidden"
        }
      }
      const newIndex = { index: shootIndex + 1, heading: shootIndex * -86 }
      const animation = Object.assign(this.state.animation, newIndex)
      this.setState({ shoots: shoots, chevronState: "disabled", mobilestate: "opened", animation: animation }, () => {
        this.handleRender()
      })
    } else {
      this.updateHistory("/")
      this.handleScrollAbility(false)
      // document.getElementById("mobileindicator").style.display = "block"
      for (let shoot in shoots) shoots[shoot].activated = ""
      // determining what type of chevron to show
      let chevronCalc = "full" // default
      if (this.state.animation.index === this.state.shootCount) chevronCalc = "uponly"
      else if (this.state.animation.index === 1) chevronCalc = "downonly"

      this.setState({ shoots: shoots, chevronState: chevronCalc, mobilestate: "" }, () => {
        this.handleRender()
      })
    }
  }

  // enables or disables scrolling depending on device size & state
  handleScrollAbility = enteringShootPage => {
    const setting = enteringShootPage ? "on" : "off"
    const settings = {
      on: {
        big: { html: "visible", body: "visible hidden", root: "visible" },
        small: { html: "visible hidden", body: "visible hidden", root: undefined, rootX: "visible", rootY: "hidden" }
      },
      off: {
        big: { html: "hidden", body: "hidden", root: "unset" },
        small: { html: "hidden visible", body: "hidden visible", root: "unset" }
      }
    }
    const html = document.documentElement.style
    const body = document.body.style
    const root = document.getElementById("root").style
    const overflowSize = window.innerWidth > 1200 ? settings[setting].big : settings[setting].small
    html.overflow = overflowSize.html
    body.overflow = overflowSize.body
    root.overflow = overflowSize.root // overriden by next lines where appropriate
    root.overflowX = overflowSize.rootX
    root.overflowY = overflowSize.rootY
  }

  // Redirects vertical scrolling to horizontal scrolling when viewing a shoot
  // Unbinds fake desktop navigation in place upon opening a shoot
  handleScrollWheel = event => {
    const deltaY = event.deltaY || undefined
    if (!deltaY || this.state.scrolling || window.innerWidth < 1200) return
    else if (this.state.chevronState !== "disabled") {
      // i.e. not in a gallery
      this.setState({ scrolling: true }, () => {
        deltaY > 0 ? this.handleGalleryScroll(true) : this.handleGalleryScroll(false) // down = true
        setTimeout(() => {
          this.setState({ scrolling: false })
        }, 450)
      })
    } else {
      let multiplier = 1
      // firefox doesn't like this hack
      if (isFirefox) multiplier = 50
      event.currentTarget.scrollLeft += (event.deltaY + event.deltaX) * multiplier
      event.preventDefault()
    }
  }

  handleRender() {
    let rendered = []
    const { shoots, animation } = this.state
    if (shoots) {
      gallery - back
      const maxAllowableLoad = isMobile ? shoots.length : animation.index !== shoots.length ? animation.index + 1 : shoots.length
      for (let shoot = 0; shoot < maxAllowableLoad; shoot++) {
        const currentShoot = shoots[shoot]
        const position = Number(currentShoot.isInHomePosition) - 1
        let photoshoot = <Photoshoot key={position} data={currentShoot} handlePageNavigation={this.handlePageNavigation} />
        rendered[position] = photoshoot
      }
      return rendered
    } else return <Redirect to="/"></Redirect>
  }

  render() {
    return (
      <div id="gallery" className={this.state.mobilestate}>
        <div id="animationbox" key={"animation helper"} data-motion={this.state.scrolling} style={this.state.animation.style}></div>
        {this.handleRender()}
        <ChevronNavigation handleGalleryScroll={this.handleGalleryScroll} chevronState={this.state.chevronState} />
      </div>
    )
  }
}

export default Gallery
