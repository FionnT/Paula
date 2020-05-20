import React, { useState } from "react"
import "./styles.sass"

export default function GallerySelection(props) {
  const [unlocked, toggle] = useState(false)
  const [canAlterOrder, toggleDisplay] = useState(true)

  const handleActivate = (e, gallery) => {
    Array.from(document.getElementsByClassName("active")).forEach(element => element.classList.remove("active"))
    e.target.classList.add("active")
    props.onActivate(gallery)
  }

  const submitHomePositionChanges = props.submitHomePositionChanges.bind(this)
  const onToggleGalleryType = props.onToggleGalleryType.bind(this)

  const toggleAndSave = () => {
    if (unlocked) submitHomePositionChanges()
    toggle(!unlocked)
  }

  const toggleType = (e, type) => {
    onToggleGalleryType(type)
    if (type === "homeGalleries") toggleDisplay(true)
    else toggleDisplay(false)

    let menuElement = document.getElementById("type-menu")
    let firstOption = menuElement.childNodes[1] // first element is the chevron
    menuElement.insertBefore(e.target, firstOption) // new element to insert, which element to insert it before
  }

  return (
    <div id="gallery-menu">
      <ul id="type-menu">
        <span>
          <i className="las la-angle-down"></i>
        </span>
        <li onClick={e => toggleType(e, "homeGalleries")}>Home Page</li>
        <li onClick={e => toggleType(e, "privateGalleries")}>Private</li>
        <li onClick={e => toggleType(e, "unpublishedGalleries")}>Unpublished</li>
      </ul>
      {props.galleries.length
        ? props.galleries.map((gallery, index) => {
            return (
              <div key={gallery.title + gallery.isInHomePosition} className="gallery-selector-container">
                <div className={index === 0 ? "active gallery-selector" : "gallery-selector "} onClick={e => handleActivate(e, gallery)}>
                  <span>{gallery.isInHomePosition}.</span>
                  <p>{gallery.title}</p>
                </div>
                {canAlterOrder ? (
                  <div className={unlocked ? "alter-order" : "alter-order hidden"}>
                    <span onClick={unlocked ? () => props.onHomeOrderChange(gallery, "up") : null}>
                      <i className="las la-arrow-up"></i>
                    </span>
                    <span onClick={unlocked ? () => props.onHomeOrderChange(gallery, "down") : null}>
                      <i className="las la-arrow-down"></i>
                    </span>
                  </div>
                ) : null}
              </div>
            )
          })
        : null}
      {props.galleries.length ? <h2 onClick={props.onAddGallery}>+ Add Gallery </h2> : <h2 onClick={props.onAddGallery}>+ Add Gallery </h2>}

      {canAlterOrder ? (
        <div className="order-lock-toggle" onClick={toggleAndSave}>
          {unlocked ? <i className="las la-lock-open"></i> : <i className="las la-lock"></i>}
        </div>
      ) : null}
    </div>
  )
}
