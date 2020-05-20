import React, { Component } from "react"
import { uuid } from "uuidv4"
import Async from "react-async"

import { GallerySelection } from "../../../components/atoms"
import { GalleryConfiguration, Navigation } from "../../../components/organisms"
import { pageNotification } from "../../../utilities"

import "./styles.sass"

const emptyGallery = {
  title: "",
  url: "",
  itemOrder: [],
  isInHomePosition: undefined,
  _id: uuid()
}

class GalleriesAdmin extends Component {
  constructor() {
    super()
    this.state = {
      galleries: undefined,
      selectedGalleries: undefined,
      selectedType: undefined,
      selectedPhotoshoot: undefined
    }
  }

  fetchGalleries = () => {
    let server = process.env.REACT_APP_API_URL + "/photoshoots/all"
    return new Promise(resolve => {
      fetch(server, { credentials: "include", mode: "cors" })
        .then(res => (res.ok ? res.json() : res))
        .then(res =>
          this.setState(
            {
              galleries: res,
              selectedGalleries: res.homeGalleries,
              selectedType: "homeGalleries",
              selectedPhotoshoot: res.homeGalleries[0]
            },
            () => {
              resolve(res)
            }
          )
        )
    })
  }

  onActivateGallery = gallery => this.setState({ selectedPhotoshoot: gallery })

  onToggleGalleryType = selectedType => {
    let selectedGalleries = this.state.galleries[selectedType]
    let selectedPhotoshoot
    selectedGalleries.length ? (selectedPhotoshoot = selectedGalleries[0]) : (selectedPhotoshoot = false)

    this.setState({ selectedGalleries, selectedPhotoshoot, selectedType })
  }

  onAddGallery = () => {
    let galleries = this.state.galleries
    let collection = galleries[this.state.selectedType]
    let newGallery = Object.assign({}, emptyGallery)
    const { length } = collection

    newGallery.isInHomePosition = length + 1
    collection.push(newGallery)
    let updatedMaster = Object.assign(galleries, collection)

    this.setState({ galleries: updatedMaster, selectedGalleries: collection, selectedPhotoshoot: newGallery }, () => {
      let galleries = Array.from(document.querySelectorAll(".gallery-selector-container"))
      let newGallerySelector = galleries[galleries.length - 1].childNodes[0]
      Array.from(document.querySelectorAll(".active")).forEach(element => element.classList.remove("active"))
      newGallerySelector.classList.add("active")
    })
  }

  onGalleryDetailChange = modifiedGallery => {
    // Trust me, this is as optimised as you can make it.
    let galleries = this.state.galleries
    let collection = galleries[this.state.selectedType]
    let galleryIndex
    collection.forEach((gallery, index) => {
      if (gallery._id === modifiedGallery._id) galleryIndex = index
    })

    let updatedGallery = Object.assign(collection[galleryIndex], modifiedGallery) // Create a clone of the original, and update the fields
    collection[galleryIndex] = updatedGallery // Update the original

    let updatedMaster = Object.assign(galleries, collection)

    this.setState({ galleries: updatedMaster, selectedGalleries: collection, selectedGallery: updatedGallery })
  }

  onHomeOrderChange = (editingGallery, direction) => {
    const originalPosition = editingGallery.isInHomePosition
    let galleries = this.state.galleries
    let homeGalleries = this.state.galleries.homeGalleries // You can only re-arrange the home galleries

    if (originalPosition !== 1 && direction === "up") {
      homeGalleries.forEach(gallery => {
        if (gallery.isInHomePosition === originalPosition - 1) gallery.isInHomePosition += 1
        else if (gallery.isInHomePosition === originalPosition) gallery.isInHomePosition -= 1
      })
    } else if (originalPosition !== homeGalleries.length + 1 && direction === "down") {
      homeGalleries.forEach(gallery => {
        if (gallery.isInHomePosition === originalPosition + 1) gallery.isInHomePosition -= 1
        else if (gallery.isInHomePosition === originalPosition) gallery.isInHomePosition += 1
      })
    } else return

    homeGalleries.sort((a, b) => {
      if (a.isInHomePosition > b.isInHomePosition) return 1
      else if (a.isInHomePosition < b.isInHomePosition) return -1
      else return 0
    })
    let updatedMaster = Object.assign(galleries, homeGalleries)
    this.setState({ galleries: updatedMaster, selectedGalleries: homeGalleries }) // You can only re-arrange the home galleries
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
      body: JSON.stringify(this.state.galleries.homeGalleries)
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
                    galleries={this.state.selectedGalleries}
                    onAddGallery={this.onAddGallery}
                    onToggleGalleryType={this.onToggleGalleryType}
                    submitHomePositionChanges={this.submitHomePositionChanges}
                  />
                  <GalleryConfiguration
                    selected={this.state.selectedPhotoshoot}
                    selectedType={this.state.selectedType}
                    onGalleryDetailChange={this.onGalleryDetailChange}
                    title="Add a new gallery"
                  />
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
