import React from "react"
import "./styles.sass"

class DropZoneImage extends React.Component {
  render() {
    const imageStyle = { backgroundImage: "url(" + this.props.src + ")" }
    return (
      <li className="dropzone-image-container">
        <div className="dropzone-image" style={imageStyle}></div>
        <span onClick={this.props.removeImage}>
          <i className="las la-arrow-left"></i>
        </span>
        <span className="delete">
          <i className="las la-trash"></i>
        </span>
        <span onClick={this.props.removeImage}>
          <i className="las la-arrow-right  "></i>
        </span>
      </li>
    )
  }
}

export default DropZoneImage
