import React, { Component } from "react"
import Dropzone from "react-dropzone"
import { Button, DropZoneImage } from "../../atoms"
import "./styles.sass"

class FileDropZone extends Component {
  constructor(props) {
    super(props)
    this.onDrop = files => {
      let new_files = files
      if (this.state.files.length) {
        new_files = this.state.files.slice()
        files.forEach(file => {
          new_files.push(file)
        })
      }
      this.setState({ files: new_files })
    }

    this.state = {
      files: []
    }
    this.children = this.props.children
  }

  render() {
    const files = () => {
      let file_array = []
      if (this.state.files?.length) {
        this.state.files.forEach(file => {
          const file_url = URL.createObjectURL(file)
          file_array.push(<DropZoneImage alt={file.name} key={file.name} src={file_url} />)
        })
      }
      return file_array
    }

    return (
      <Dropzone onDrop={this.onDrop} multiple={this.props.multiple} accept={this.props.accept}>
        {({ getRootProps, getInputProps }) => (
          <>
            <section className="container">
              <div className="inputField" style={{ height: "2vh" }}>
                <p>{this.children}</p>
              </div>
              <div {...getRootProps({ className: "filedropzone" })}>
                <input {...getInputProps()} />
                <ul>{files()}</ul>
                <div id="infoarea">
                  <p>Drag and drop your photos here</p>
                  <Button className="center">Or browse your files</Button>
                </div>
              </div>
            </section>
          </>
        )}
      </Dropzone>
    )
  }
}

export default FileDropZone
