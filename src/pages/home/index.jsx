import React, { Component } from "react"
import { Gallery, Navigation } from "../../components/organisms"

class Home extends Component {
  constructor(props) {
    super(props)
    this.updateHistory = this.updateHistory.bind(this)

    this.state = {
      shootname: undefined,
      chevronState: "downonly"
    }
  }

  updateHistory(url, callback) {
    let newURL = !url ? false : url === "/" ? undefined : "/shoot/" + url
    if (newURL && this.props.history.location.pathname !== newURL && !newURL.match("//")) {
      this.props.history.push(newURL)
      this.setState({ shootname: url })
    } else if (url === "/") {
      this.setState({ shootname: newURL })
      this.props.history.push("/")
    } else if (!url) {
      this.props.history.push(this.props.history.location.pathname)
    }
    if (callback) callback(newURL)
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.shootname !== this.state.shootname) this.setState({ shootname: this.props.match.params.shootname })
  }
  componentDidUpdate() {
    if (this.props.location.state && this.props.location.state.shootname !== this.state.shootname) this.setState({ shootname: this.props.location.state.shootname })
  }

  render() {
    return (
      <>
        <Navigation />
        <Gallery shootname={this.state.shootname} updateHistory={this.updateHistory} chevronState={this.state.chevronState} />
      </>
    )
  }
}

export default Home
