import React from "react"
import { Gallery, Navigation } from "../../components/organisms"

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.updateHistory = this.updateHistory.bind(this)

    this.state = {
      shootname: undefined,
      chevronState: "downonly"
    }
  }

  updateHistory(url) {
    let newURL = "/shoot/" + url
    if (this.props.history.location.pathname !== newURL && !newURL.match("//")) {
      this.props.history.push(newURL)
      this.setState({ shootname: url })
    } else if (url === "/") {
      this.setState({ shootname: undefined })
      this.props.history.push("/")
    }
  }

  componentDidMount() {
    if (this.props.match.params && this.props.match.params.shootname !== this.state.shootname) this.setState({ shootname: this.props.match.params.shootname })
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.state && this.props.location.state.shootname !== this.state.shootname) this.setState({ shootname: this.props.location.state.shootname })
  }
  render() {
    return (
      <React.Fragment>
        <Navigation />
        <Gallery shootname={this.state.shootname} updateHistory={this.updateHistory} chevronState={this.state.chevronState} />
      </React.Fragment>
    )
  }
}

export default Home
//
