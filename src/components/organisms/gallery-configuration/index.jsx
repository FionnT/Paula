import React, { Component } from "react"
import { validateText } from "../../../utilities"
import { Input } from "../../atoms"
import { FileDropZone } from "../../molecules"
import { Button } from "../../../components/atoms"
import "./styles.sass"

class GalleryConfiguration extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  textUpdater = event => {
    validateText(event, this.state, data => {
      this.setState({ name: data.name })
    })
  }

  render() {
    const { selected } = this.props
    return (
      <div id="gallery-configuration">
        <h2>{selected.title}</h2>
        <Input type="name" textController={this.textUpdater} placeholder="Gallery Name*" value={selected.title !== "Add a new gallery" ? selected.title : ""} />
        <FileDropZone multiple={true} existing={selected.files} accept="image/*">
          Gallery Photos
        </FileDropZone>
        <div style={{ width: "80.5%", margin: "50px 0" }}>
          <Button className="center">Save Gallery!</Button>
        </div>
      </div>
    )
  }
}

export default GalleryConfiguration
