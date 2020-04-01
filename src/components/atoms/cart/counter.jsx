import React, { Component } from "react";
import "./styles.sass";

class CounterClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialNumber: this.props.initialNumber
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.initialNumber !== this.state.initialNumber)
      this.setState({ initialNumber: newProps.initialNumber });
  }

  handleIncrement = initialNumber => {
    Number(initialNumber)
      ? this.setState({
          initialNumber: Number(initialNumber) + 1
        })
      : this.setState({ initialNumber: 1 });
  };

  render() {
    return (
      <div>
        <span>{this.state.initialNumber}</span>
        <button
          onClick={() => {
            this.handleIncrement(this.state.initialNumber);
          }}
        >
          {this.props.initialText}
        </button>
      </div>
    );
  }
}

export default CounterClass;