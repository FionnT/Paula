import React from "react"
import "./styles.sass"

class DropZoneImage extends React.Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef()
  }

  render() {
    const imageStyle = { backgroundImage: "url(" + this.props.src + ")" }
    return (
      <li className="dropzone-image-container">
        <div className="dropzone-image" style={imageStyle}></div>
        <span onClick={() => this.props.onModificationOfImages("left", this.props.index)}>
          <i className="las la-arrow-left"></i>
        </span>
        <span className="delete" onClick={() => this.props.onModificationOfImages("delete", this.props.index)}>
          <i className="las la-trash"></i>
        </span>
        <span onClick={() => this.props.onModificationOfImages("right", this.props.index)}>
          <i className="las la-arrow-right"></i>
        </span>
      </li>
    )
  }
}

export default DropZoneImage
