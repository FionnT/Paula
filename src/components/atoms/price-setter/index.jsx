import React, { Component } from "react"
import "./styles.sass"
import Input from "../input"

class PriceSetter extends Component {
  constructor(props) {
    super(props)

    this.textController = this.props.textController
    this.addSize = this.props.addSize
    this.removeSize = this.props.removeSize
    this.state = {}
    this.state.sizes = this.props.data
  }

  componentDidUpdate() {
    if (this.state.sizes.toString() != this.props.data.toString()) this.setState({ sizes: this.props.data })
  }

  render() {
    return (
      <div id="price-setter">
        {this.state.sizes.map((size, index) => {
          return (
            <ul>
              <li key={"type" + index}>
                <Input
                  type="type"
                  textController={e => this.textController(e, index, "type")}
                  autocomplete="title"
                  placeholder={<i className="las la-crop-alt"></i>}
                  value={size.type}
                />
              </li>
              <li key={"measurements" + index}>
                <Input
                  type="measurements"
                  textController={e => this.textController(e, index, "measurements")}
                  autocomplete="size"
                  placeholder={<i className="las la-ruler"></i>}
                  value={size.measurements}
                />
              </li>
              <li key={"cost" + index}>
                <Input
                  type="cost"
                  textController={e => this.textController(e, index, "cost")}
                  autocomplete="price"
                  placeholder={<i className="las la-euro-sign"></i>}
                  value={size.cost}
                />
              </li>
              <button onClick={() => this.removeSize(index)} key={"button" + index}>
                <i className="las la-times"></i>
              </button>
            </ul>
          )
        })}

        <div id="add-new" onClick={this.addSize}>
          <p>
            <i className="las la-plus-circle"></i>
          </p>
        </div>
      </div>
    )
  }
}

export default PriceSetter
