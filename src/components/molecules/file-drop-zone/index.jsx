import React, { Component } from "react"
import Dropzone from "react-dropzone"
import { Draggable, Droppable } from "react-beautiful-dnd"
import { Button, DropZoneImage } from "../../atoms"
import "./styles.sass"
const MovableSection = props => <ul>{props.children}</ul>

class FileDropZone extends Component {
  constructor(props) {
    super(props)
    this.onDrop = files => {
      let new_files = files
      let rendered = this.state.rendered.slice()
      let { index } = this.state
      if (this.state.files.length) new_files = this.state.files.slice()
      files.forEach(file => {
        index += 1
        const file_src = URL.createObjectURL(file)
        new_files.push(file)
        rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} />)
      })
      this.setState({ files: new_files, rendered: rendered, index: index })
    }

    this.state = {
      files: [],
      rendered: [],
      existing: this.props.existing,
      index: 0
    }
    this.children = this.props.children
  }

  componentDidUpdate() {
    if (this.props.existing && this.state.existing !== this.props.existing) {
      const { existing, url } = this.props
      let { index } = this.state
      let rendered = []
      if (existing) {
        console.log(existing)
        existing.forEach((file, index) => {
          index += 1
          const file_src = "/galleries/" + url + "/" + file + ".jpg"
          rendered.push(<DropZoneImage key={index} alt={file} name={file} src={file_src} index={index} />)
        })
      }
      this.setState({ rendered: rendered, existing: this.props.existing, index: index })
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
              <p>{this.children}</p>
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
