import React, { Component } from "react"
import Dropzone from "react-dropzone"
import { Button, DropZoneImage } from "../../atoms"
import "./styles.sass"

class FileDropZone extends Component {
  constructor(props) {
    super(props)
    // Handle adding new files
    this.onDrop = newFiles => {
      let rendered = this.state.rendered.slice()
      let files = this.state.files.length ? this.state.files.slice() : []
      let { index } = this.state
      newFiles.forEach(file => {
        const file_src = URL.createObjectURL(file)
        files.push(file)
        rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} onModificationOfImages={this.onModificationOfImages} />)
        index += 1
      })
      const combined = this.props.existing.itemOrder.concat(files)
      this.setState({ files, rendered, index, combined })
    }

    this.onGalleryDetailChange = this.props.onGalleryDetailChange.bind(this)

    this.state = {
      files: [],
      rendered: [],
      combined: this.props.existing.itemOrder,
      existing: this.props.existing.itemOrder,
      index: 0
    }
  }

  // Handle existing gallery files
  componentDidUpdate() {
    const existing = this.props.existing.itemOrder
    if (existing && this.state.existing !== existing) {
      let index = 0
      let rendered = []
      if (existing) {
        existing.forEach(file => {
          const file_src = "/galleries/" + this.props.url + "/" + file + ".jpg"
          rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} onModificationOfImages={this.onModificationOfImages} />)
          index += 1
        })
      }
      this.setState({ rendered, existing, index, combined: existing })
    }
  }

  componentDidMount() {
    const existing = this.state.existing
    if (existing) {
      let index = 0
      let rendered = []
      if (existing) {
        existing.forEach(file => {
          const file_src = "/galleries/" + this.props.url + "/" + file + ".jpg"
          rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} onModificationOfImages={this.onModificationOfImages} />)
          index += 1
        })
      }
      this.setState({ rendered, existing, index, combined: existing })
    }
  }

  onModificationOfImages = (method, index) => {
    const currentOrder = this.state.combined.slice()
    const movedItem = currentOrder[index]
    const { length } = currentOrder

    if (method === "left" && index !== 0) {
      currentOrder.splice(index, 1, currentOrder[index - 1])
      currentOrder.splice(index - 1, 1, movedItem)
    } else if (method === "right" && index !== length - 1) {
      currentOrder.splice(index, 1, currentOrder[index + 1])
      currentOrder.splice(index + 1, 1, movedItem)
    } else if (method === "delete") currentOrder.splice(index, 1)
    else return

    this.refreshRender(currentOrder)
    this.onGalleryDetailChange({ itemOrder: currentOrder, _id: this.props.existing._id })
  }

  refreshRender = newOrder => {
    let rendered = []
    let file_src
    if (newOrder) {
      newOrder.forEach((file, index) => {
        if (typeof file != "object") file_src = "/galleries/" + this.props.url + "/" + file + ".jpg"
        else file_src = URL.createObjectURL(file)
        rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} onModificationOfImages={this.onModificationOfImages} />)
      })
      this.setState({ rendered, combined: newOrder, index: rendered.length })
    }
  }

  openFileSelect = () => {
    if (this.dropzoneRef) {
      this.dropzoneRef.open()
    }
  }

  render() {
    return (
      <Dropzone
        onDrop={this.onDrop}
        multiple={this.props.multiple}
        accept={this.props.accept}
        noClick={true}
        ref={ref => {
          this.dropzoneRef = ref
        }}
        droppable
      >
        {({ getRootProps, getInputProps }) => (
          <section className="container">
            <div className="inputField" style={{ height: "2vh" }}>
              <p>{this.props.children}</p>
            </div>
            <div {...getRootProps({ className: "filedropzone" })}>
              <input {...getInputProps()} />
              <ul>{this.state.rendered}</ul>
              <div id="infoarea">
                <p>Drag and drop your photos here</p>
                <Button onSubmit={this.openFileSelect} className="center">
                  Or browse your files
                </Button>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
    )
  }
}

export default FileDropZone
