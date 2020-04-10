import React, { Component } from "react"
import Async from "react-async"
import { GallerySelection } from "../../../components/atoms"
import { GalleryConfiguration, Navigation } from "../../../components/organisms"
import "./styles.sass"

const defaultSettings = { title: "Add a new gallery", files: null }

class GalleriesAdmin extends Component {
  constructor() {
    super()
    this.state = {
      galleries: undefined,
      selectedGallery: defaultSettings
    }
  }

  fetchGalleries = () => {
    let server = process.env.REACT_APP_API_URL + "/photoshoots/home"
    return new Promise(resolve => {
      fetch(server, { credentials: "include", mode: "cors" })
        .then(res => (res.ok ? res.json() : res))
        .then(res => this.setState({ galleries: res }, resolve(res)))
    })
  }

  activateOption = gallery => {
    let update = gallery === null ? defaultSettings : gallery
    this.setState({ selectedGallery: update })
  }

  render() {
    return (
      <>
        <Navigation />
        <Async promiseFn={this.fetchGalleries}>
          {({ data, err, isLoading }) => {
            if (isLoading) return "Loading..."
            if (err) return <p>BORKED</p>
            if (data) {
              return (
                <div id="admin" className="admin-galleries">
                  <GallerySelection onActivate={this.activateOption} galleries={this.state.galleries} />
                  <GalleryConfiguration selected={this.state.selectedGallery} title="Add a new gallery" />
                </div>
              )
            }
          }}
        </Async>
      </>
    )
  }
}

export default GalleriesAdmin
