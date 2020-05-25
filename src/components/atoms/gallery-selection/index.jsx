import React, { useState } from "react"
import "./styles.sass"

export default function GallerySelection(props) {
  const [unlocked, toggle] = useState(false) // controls display of the lock icon

  const submitHomePositionChanges = props.submitHomePositionChanges.bind(this)
  const onToggleSelectedGalleriesType = props.onToggleSelectedGalleriesType.bind(this)
  const canAlterOrder = props.galleries[0]?.isInHomePosition ? true : false

  const toggleAndSave = () => {
    if (unlocked) submitHomePositionChanges()
    toggle(!unlocked)
  }

  const toggleType = (e, type) => {
    onToggleSelectedGalleriesType(type)
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
        <li data-type="homeGalleries" onClick={e => toggleType(e, "homeGalleries")}>
          Home Page
        </li>
        <li data-type="privateGalleries" onClick={e => toggleType(e, "privateGalleries")}>
          Private
        </li>
        <li data-type="unpublishedGalleries" onClick={e => toggleType(e, "unpublishedGalleries")}>
          Unpublished
        </li>
      </ul>
      {props.galleries.length
        ? props.galleries.map(gallery => {
            return (
              <div key={gallery.title + gallery.isInHomePosition} className="gallery-selector-container">
                <div className={gallery._id === props.selectedID ? "active gallery-selector" : "gallery-selector "} onClick={() => props.onActivate(gallery)}>
                  {gallery.isInHomePosition ? <span>{gallery.isInHomePosition}.</span> : <span></span>}
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
