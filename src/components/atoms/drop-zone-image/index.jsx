import React from "react"
import "./styles.sass"

const DropZoneImage = props => {
  const imageStyle = { backgroundImage: "url(" + props.src + ")" }

  return (
    <div className="dropzone-image-container">
      <div className="dropzone-image" style={imageStyle}></div>
      <span onClick={props.removeImage}>Remove</span>
    </div>
  )
}

export default DropZoneImage
