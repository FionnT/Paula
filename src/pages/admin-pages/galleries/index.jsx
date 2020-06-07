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
  isOnHomeScreen: false,
  isPublished: false,
  isPasswordProtected: false,
  isCreatingPassword: true, // Used as local boolean for display of password input fields
  password: false,
  _id: undefined
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

  componentDidUpdate() {
    if (!this.state.selectedPhotoshoot._id) this.onAddGallery()
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
              selectedGalleries: res.homeGalleries, // Set defaults
              selectedType: "homeGalleries",
              selectedPhotoshoot: res.homeGalleries[0]?._id ? res.homeGalleries[0] : { _id: undefined } // _id is required for render => Case: 0 galleries exist
            },
            () => {
              resolve(res)
            }
          )
        )
    })
  }

  onAddGallery = () => {
    let galleries = this.state.galleries
    let collection = galleries[this.state.selectedType]
    let newGallery = Object.assign({}, emptyGallery) // Clone the emptyGallery object into a new object

    const { length } = collection

    newGallery.isInHomePosition = length ? collection[length - 1].isInHomePosition + 1 : 1
    newGallery._id = uuid()
    newGallery.isNew = true

    switch (this.state.selectedType) {
      case "homeGalleries":
        newGallery.isOnHomeScreen = true
        newGallery.isPublished = true
        newGallery.isPasswordProtected = false
        break
      case "privateGalleries":
        newGallery.isOnHomeScreen = false
        newGallery.isPublished = true
        newGallery.isInHomePosition = false
        break
      case "unpublishedGalleries":
        newGallery.isOnHomeScreen = false
        newGallery.isPublished = false
        newGallery.isInHomePosition = false
        break
      default:
        break
    }

    collection.push(newGallery) // Collection is an array
    let updatedMaster = Object.assign(galleries, collection) // Clone original, and update it

    this.setState({ galleries: updatedMaster, selectedGalleries: collection, selectedPhotoshoot: newGallery }, () => {
      let galleries = Array.from(document.querySelectorAll(".gallery-selector-container"))
      if (galleries.length) {
        let newGallerySelector = galleries[galleries.length - 1].childNodes[0]
        Array.from(document.querySelectorAll(".active.gallery-selector")).forEach(element => element.classList.remove("active"))
        newGallerySelector.classList.add("active")
      }
    })
  }

  onActivateGallery = gallery => {
    gallery.isNew = false
    this.setState({ selectedPhotoshoot: gallery })
  }

  onDeleteGallery = _id => {
    let galleries = this.state.galleries
    let collection = galleries[this.state.selectedType]
    let galleryIndex

    collection.forEach((gallery, index) => {
      if (gallery._id === _id) galleryIndex = index
    })

    collection.splice(galleryIndex, 1)
    if (this.state.selectedType === "homeGalleries") {
      collection.forEach((photoshoot, index) => {
        photoshoot.isInHomePosition = index + 1
      })
    }

    let updatedMaster = Object.assign(galleries, collection)

    this.setState({ galleries: updatedMaster, selectedGalleries: collection, selectedGallery: collection[0] }, () => {
      let server = process.env.REACT_APP_API_URL + "/galleries/delete"
      fetch(server, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify({ _id })
      }).then(res => {
        if (res.ok) {
          if (this.state.selectedType === "homeGalleries") this.submitHomePositionChanges(true)
          pageNotification([false, "Gallery Deleted!"])
        } else pageNotification([false, "Couldn't delete gallery, refresh and try again!"])
      })
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

  onToggleSelectedGalleriesType = (selectedType, forceSelected) => {
    let selectedGalleries = this.state.galleries[selectedType]
    let selectedPhotoshoot

    // 0 is falsey, and an array index
    if (selectedGalleries.length && typeof forceSelected === "undefined") selectedPhotoshoot = selectedGalleries[0]
    else if (selectedGalleries.length) selectedPhotoshoot = selectedGalleries[forceSelected]
    else selectedPhotoshoot = false // used to display different UI if there are no galleries in that category

    if (selectedPhotoshoot) selectedPhotoshoot.isNew = false

    this.setState({ selectedGalleries, selectedPhotoshoot, selectedType }, () => {
      if (typeof forceSelected !== "undefined") {
        // Maintain highlighting on the select element
        let availableGalleries = document.querySelectorAll(".gallery-selector-container")
        Array.from(availableGalleries).forEach(element => element.childNodes[0].classList.remove("active"))
        availableGalleries[forceSelected].childNodes[0].classList.add("active")
      }
    })
  }

  onToggleGalleryType = (type, id) => {
    let galleries = this.state.galleries
    let oldCollection = galleries[this.state.selectedType]
    let newCollection = galleries[type]
    let galleryIndex
    let updatedGallery

    if (type !== this.state.selectedType) {
      oldCollection.forEach((gallery, index) => {
        if (gallery._id === id) galleryIndex = index
      })

      newCollection.push(oldCollection[galleryIndex])
      oldCollection = oldCollection.filter(gallery => gallery._id !== id)
      updatedGallery = newCollection[newCollection.length - 1]

      switch (type) {
        case "homeGalleries":
          updatedGallery.isOnHomeScreen = true
          updatedGallery.isPublished = true
          updatedGallery.isInHomePosition = this.state.galleries.homeGalleries.length
          updatedGallery.isPasswordProtected = false
          break
        case "privateGalleries":
          updatedGallery.isOnHomeScreen = false
          updatedGallery.isPublished = true
          updatedGallery.isInHomePosition = false
          if (this.state.selectedType === "homeGalleries") oldCollection.forEach((gallery, index) => (gallery.isInHomePosition = index + 1))
          break
        case "unpublishedGalleries":
          updatedGallery.isOnHomeScreen = false
          updatedGallery.isPublished = false
          updatedGallery.isInHomePosition = false
          if (this.state.selectedType === "homeGalleries") oldCollection.forEach((gallery, index) => (gallery.isInHomePosition = index + 1))
          break
        default:
          return
      }

      galleries[this.state.selectedType] = oldCollection // i.e. Original collection, less the removed one
      galleries[type] = newCollection // i.e. That gallery type plus the added one

      // Swap the Category Option menu display
      Array.from(document.querySelectorAll("#type-menu li")).forEach(element => {
        if (element.dataset.type === type) {
          let menuElement = document.getElementById("type-menu")
          let currentElement = menuElement.childNodes[1]
          menuElement.insertBefore(element, currentElement)
        }
      })

      this.setState({ galleries }, () => {
        this.onToggleSelectedGalleriesType(type, newCollection.length - 1)
      })
    }
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

  submitHomePositionChanges = silent => {
    let server = process.env.REACT_APP_API_URL + "/galleries/update-positions"
    fetch(server, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      mode: "cors",
      body: JSON.stringify(this.state.galleries.homeGalleries)
    }).then(res => {
      if (!silent) {
        res.ok ? pageNotification([true, "New order saved"]) : pageNotification([false, "Couldn't save new details, try again!"])
      }
    })
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
                    onToggleSelectedGalleriesType={this.onToggleSelectedGalleriesType}
                    submitHomePositionChanges={this.submitHomePositionChanges}
                    selectedID={this.state.selectedPhotoshoot._id}
                  />
                  <GalleryConfiguration
                    selected={this.state.selectedPhotoshoot}
                    selectedType={this.state.selectedType}
                    onGalleryDetailChange={this.onGalleryDetailChange}
                    onToggleGalleryType={this.onToggleGalleryType}
                    onDeleteGallery={this.onDeleteGallery}
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
