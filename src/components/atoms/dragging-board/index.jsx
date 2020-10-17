import React, { Component } from "react"
import clickdrag from "react-clickdrag"
import { browserName } from "react-device-detect"

class Dragger extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lastPositionX: 0,
      currentX: 0
    }
  }

  browserSpecificModification = () => {
    let scrollModifier = {
      Firefox: 8,
      Chrome: 8,
      Edge: 15,
      Opera: 10,
      Safari: 15
    }
    return scrollModifier[browserName]
  }

  componentWillReceiveProps(nextProps) {
    const draggingToTheRight = nextProps.dataDrag.moveDeltaX > 0 ? true : false
    const newPosition = Math.round((this.state.currentX + nextProps.dataDrag.moveDeltaX) / this.browserSpecificModification())

    if (draggingToTheRight) {
      this.setState({ currentX: newPosition, lastPositionX: this.state.currentX })
      document.body.scrollLeft += newPosition * -1
    } else if (!draggingToTheRight) {
      this.setState({ lastPositionX: this.state.currentX, currentX: newPosition })
      document.body.scrollLeft -= newPosition
    }
  }

  render() {
    return (
      <div
        id="drag-handler"
        onMouseDown={() => this.setState({ className: "is-grabbing" })}
        onMouseUp={() => this.setState({ className: "" })}
        className={this.state.className}
      ></div>
    )
  }
}

const DraggingBoard = clickdrag(Dragger, { touch: false })

export default DraggingBoard
