import React, { Component } from "react"
import { uuid } from "uuidv4"
import Async from "react-async"

import { GallerySelection } from "../../../components/atoms"
import { GalleryConfiguration, Navigation } from "../../../components/organisms"
import { pageNotification } from "../../../utilities"

import "./styles.sass"

class GalleriesAdmin extends Component {
  constructor() {
    super()
    this.state = {
      galleries: undefined,
      selectedGallery: undefined
    }
  }

  fetchGalleries = () => {
    let server = process.env.REACT_APP_API_URL + "/photoshoots/all"
    return new Promise(resolve => {
      fetch(server, { credentials: "include", mode: "cors" })
        .then(res => (res.ok ? res.json() : res))
        .then(res =>
          this.setState({ galleries: res, selectedGallery: res[0] }, () => {
            resolve(res)
          })
        )
    })
  }

  onActivateGallery = gallery => this.setState({ selectedGallery: gallery })

  onAddGallery = () => {
    let existingGalleries = this.state.galleries
    let newGallery = {
      title: "New Gallery",
      url: "example",
      itemOrder: [],
      isInHomePosition: existingGalleries.length + 1,
      _id: uuid()
    }
    existingGalleries.push(newGallery)
    this.setState({ galleries: existingGalleries, selectedGallery: newGallery }, () => {
      let galleries = Array.from(document.querySelectorAll(".gallery-selector-container"))
      let newGallerySelector = galleries[galleries.length - 1].childNodes[0]
      Array.from(document.querySelectorAll(".active")).forEach(element => element.classList.remove("active"))
      newGallerySelector.classList.add("active")
    })
  }

  onGalleryDetailChange = modifiedGallery => {
    let galleryBlob = this.state.galleries
    let found
    galleryBlob.forEach(gallery => {
      if (modifiedGallery._id.toString() === gallery._id.toString()) {
        found = true
        Object.assign(gallery, modifiedGallery)
      }
    })
    if (!found) pageNotification([false, "Couldn't find that gallery!"])
    else this.setState({ galleries: galleryBlob })
  }

  onHomeOrderChange = (editingGallery, direction) => {
    const originalPosition = editingGallery.isInHomePosition
    const existingGalleries = this.state.galleries

    if (originalPosition !== 1 && direction === "up") {
      existingGalleries.forEach(gallery => {
        if (gallery.isInHomePosition === originalPosition - 1) gallery.isInHomePosition += 1
        else if (gallery.isInHomePosition === originalPosition) gallery.isInHomePosition -= 1
      })
    } else if (originalPosition !== existingGalleries.length + 1 && direction === "down") {
      existingGalleries.forEach(gallery => {
        if (gallery.isInHomePosition === originalPosition + 1) gallery.isInHomePosition -= 1
        else if (gallery.isInHomePosition === originalPosition) gallery.isInHomePosition += 1
      })
    } else return

    existingGalleries.sort((a, b) => {
      if (a.isInHomePosition > b.isInHomePosition) return 1
      else if (a.isInHomePosition < b.isInHomePosition) return -1
      else return 0
    })

    this.setState({ galleries: existingGalleries })
  }

  submitHomePositionChanges = () => {
    let server = process.env.REACT_APP_API_URL + "/upload/update-positions"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(this.state.galleries)
    }).then(res => (res.ok ? pageNotification([true, "New order saved"]) : pageNotification([false, "Couldn't save new details, try again!"])))
  }

  render() {
    return (
      <>
        <Navigation />
        <Async promiseFn={this.fetchGalleries}>
          {({ data, err, isLoading }) => {
            if (isLoading) return <img src="/loading.gif" className="loading" alt="Page is loading" />
            if (err) return <img src="/loading.gif" className="loading" alt="Page is loading" />
            if (data) {
              return (
                <div id="admin" className="admin-galleries">
                  <GallerySelection
                    onActivate={this.onActivateGallery}
                    onHomeOrderChange={this.onHomeOrderChange}
                    galleries={this.state.galleries}
                    onAddGallery={this.onAddGallery}
                    submitHomePositionChanges={this.submitHomePositionChanges}
                  />
                  <GalleryConfiguration selected={this.state.selectedGallery} onGalleryDetailChange={this.onGalleryDetailChange} title="Add a new gallery" />
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
