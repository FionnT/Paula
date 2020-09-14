import React from "react"
import "./styles.sass"

const ChevronNavigation = props => {
  return (
    <div id="arrows" className={props.chevronState}>
      <button className="up">
        <i className="las la-angle-up" onClick={() => props.handleScrollingBetweenGalleries()}></i>
      </button>
      <button className="down" onClick={() => props.handleScrollingBetweenGalleries(true)}>
        <i className="las la-angle-down"></i>
      </button>
      <p>
        <i className="las la-angle-down"></i>
      </p>
    </div>
  )
}

export default ChevronNavigation
