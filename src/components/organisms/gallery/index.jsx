import React, { Component } from "react"
import { ChevronNavigation } from "../../atoms"
import { Photoshoot } from "../../molecules"
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
    this.updateHistory = this.props.updateHistory.bind(this)
    this.handleGalleryScroll = this.handleGalleryScroll.bind(this)
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
      mobilestate: "", // adds 60px of padding to gallery on smaller devices
      scrolling: false
    }
  }

  componentDidMount() {
    // let element = document.scrollingElement || document.documentElement
    // element.addEventListener("wheel", this.triggerFakeScroll(), { passive: false })
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

    // Redirects vertical scrolling to horizontal scrolling
    // Unbinds fake desktop navigation in place upon opening a shoot
    let element = document.scrollingElement || document.documentElement
    const handleScrollWheel = event => {
      const deltaY = event.deltaY || undefined
      if (!deltaY || this.state.scrolling || window.innerWidth < 1200) return
      else if (this.state.chevronState !== "disabled") {
        // i.e. not in a gallery
        this.setState({ scrolling: true })
        deltaY > 0 ? this.handleGalleryScroll(true) : this.handleGalleryScroll(false) // down = true
        setTimeout(() => {
          this.setState({ scrolling: false })
        }, 450)
      } else {
        event.currentTarget.scrollLeft += (event.deltaY + event.deltaX) * 0.8
        event.preventDefault()
      }
    }
    element.addEventListener("wheel", handleScrollWheel, { passive: false })

    // enables or disables scrolling depending on device size & state
    const handleScrollAbility = enteringShootPage => {
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

      if (window.innerWidth > 1200) {
        document.documentElement.style.overflow = settings[setting].big.html
        document.body.style.overflow = settings[setting].big.body
        document.getElementById("root").style.overflow = settings[setting].big.root
      } else {
        document.documentElement.style.overflow = settings[setting].small.html
        document.body.style.overflow = settings[setting].small.body
        if (settings[setting].small.root) {
          document.getElementById("root").style.overflow = settings[setting].small.root
        } else {
          document.getElementById("root").style.overflow = settings[setting].small.root
          document.getElementById("root").style.overflow = settings[setting].small.root
        }
      }
    }
    // handling of page open/close
    if (shootname) {
      this.updateHistory(shootname)
      handleScrollAbility(true)
      document.getElementById("mobileindicator").style.display = "none"

      // Parsing pretty URL from :param into the selected shoot
      for (let shoot in shoots) {
        if (shoots[shoot].url === shootname) {
          shoots[shoot].activated = "activated"
          // fix for mobile devices entering a gallery mid scroll
          // Navigation is 14vh
          // iOS Safari ignores this
          let offset = window.innerHeight * 0.86 * (shoot - 1)
          if (window.innerWidth < 1200) {
            document.documentElement.scrollTo(0, offset)
            document.body.scrollTo(0, offset)
          }
        } else shoots[shoot].activated = "hidden"
      }

      this.setState({ shoots: shoots, chevronState: "disabled", mobilestate: "opened" }, () => {
        this.renderShoots()
      })
    } else {
      this.updateHistory("/")
      handleScrollAbility(false)

      // determining what type of chevron to show
      let chevronCalc = "full" // default
      if (this.state.animation.index === this.state.shootCount) chevronCalc = "uponly"
      else if (this.state.animation.index === 1) chevronCalc = "downonly"

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
      style: { marginTop: newHeading + "vh" } // react style prop takes a JSON object
    }
    if (scrollable) this.setState({ animation: newAnimation })
  }

  renderShoots() {
    let result = []
    const { shoots } = this.state
    if (shoots) {
      for (let shoot in shoots) {
        shoots[shoot].index = shoot
        let photoshoot = <Photoshoot key={shoot} data={shoots[shoot]} handlePageNavigation={this.handlePageNavigation} />
        result.push(photoshoot)
      }
      this.setState({ rendered: result })
    } else this.setState({ rendered: <Redirect to="/"></Redirect> })
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
