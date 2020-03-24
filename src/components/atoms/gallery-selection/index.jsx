import React from "react"
import "./styles.sass"

export default function GallerySelection(props) {
  const handleActivate = (e, gallery) => {
    const availableOptions = Array.from(document.getElementsByClassName("active"))
    availableOptions.forEach(option => (option.className = ""))
    e.target.className = "active"
    props.onActivate(gallery)
  }
  return (
    <div id="gallery-menu">
      <h2 className="active" onClick={e => handleActivate(e, null)}>
        + Add Gallery
      </h2>
      {props.galleries
        ? props.galleries.map(gallery => {
            return (
              <p key={gallery.title} onClick={e => handleActivate(e, gallery)}>
                {gallery.title}
              </p>
            )
          })
        : null}
    </div>
  )
}
