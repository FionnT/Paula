import React from "react"
import "./styles.sass"

const ChevronNavigation = props => {
  return (
    <div id="arrows" className={props.chevronState}>
      <button className="up">
        <i className="las la-angle-up" onClick={() => props.handleGalleryScroll()}></i>
      </button>
      <button className="down" onClick={() => props.handleGalleryScroll(true)}>
        <i className="las la-angle-down"></i>
      </button>
      <p>
        <i className="las la-angle-down"></i>
      </p>
    </div>
  )
}

export default ChevronNavigation
