import React, { useState } from "react"
import "./styles.sass"

export default function GallerySelection(props) {
  const [unlocked, toggle] = useState(false)

  const handleActivate = (e, gallery) => {
    Array.from(document.getElementsByClassName("active")).forEach(element => element.classList.remove("active"))
    e.target.classList.add("active")
    props.onActivate(gallery)
  }

  const submitHomePositionChanges = props.submitHomePositionChanges.bind(this)

  const toggleAndSave = () => {
    if (unlocked) submitHomePositionChanges()
    toggle(!unlocked)
  }

  return (
    <div id="gallery-menu">
      <h2 className="active" onClick={props.onAddGallery}>
        + Add Gallery
      </h2>
      {props.galleries
        ? props.galleries.map((gallery, index) => {
            return (
              <div key={gallery.title} className="gallery-selector-container">
                <div className={index === 0 ? "active gallery-selector" : "gallery-selector "} onClick={e => handleActivate(e, gallery)}>
                  <span>{gallery.isInHomePosition}.</span>
                  <p>{gallery.title}</p>
                </div>
                <div className={unlocked ? "alter-order" : "alter-order hidden"}>
                  <span onClick={unlocked ? () => props.onHomeOrderChange(gallery, "up") : null}>
                    <i className="las la-arrow-up"></i>
                  </span>
                  <span onClick={unlocked ? () => props.onHomeOrderChange(gallery, "down") : null}>
                    <i className="las la-arrow-down"></i>
                  </span>
                </div>
              </div>
            )
          })
        : null}
      <div className="order-lock-toggle" onClick={toggleAndSave}>
        {unlocked ? <i className="las la-lock-open"></i> : <i className="las la-lock"></i>}
      </div>
    </div>
  )
}
