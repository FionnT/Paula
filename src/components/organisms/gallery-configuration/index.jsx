import React, { Component } from "react"
import { DragDropContext } from "react-beautiful-dnd"
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
    validateText(event, false, this.state, data => {
      this.setState({ name: data.name })
    })
  }

  onDragEnd = () => {}

  render() {
    const { selected } = this.props
    return (
      <div id="gallery-configuration">
        <h2>{selected.title}</h2>
        <div id="gallery-input-fields">
          <Input type="name" textController={this.textUpdater} placeholder="Gallery Name*" value={selected.title !== "Add a new gallery" ? selected.title : ""} />
          <Input
            type="name"
            textController={this.textUpdater}
            placeholder="Gallery URL"
            immutable="/shoot/"
            immutableWidth="13%"
            mutableWidth="87%"
            value={selected.url ? selected.url : ""}
          />
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <FileDropZone multiple={true} existing={selected.itemOrder} url={selected.url} accept="image/*">
            Gallery Photos
          </FileDropZone>
        </DragDropContext>
        <div id="gallery-input-fields">
          <Input type="password" placeholder="Add a password?" />
        </div>
        <div style={{ width: "80.5%", margin: "50px 0" }}>
          <Button className="center">Save Gallery!</Button>
        </div>
      </div>
    )
  }
}

export default GalleryConfiguration
