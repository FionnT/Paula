import React, { useState } from "react"
import { UserMenu } from "../../atoms"

export default function UserProfileButton(props) {
  const [menuStatus, toggleMenu] = useState(false)

  const Menu = () => {
    let rendered
    if (menuStatus) {
      imageStyle.boxShadow = "inset 0px 0px 2px 1px #FF7F50"
      rendered = <UserMenu updateUser={props.updateUser} />
    } else {
      imageStyle.boxShadow = ""
      rendered = null
    }
    return rendered
  }

  const imageStyle = { backgroundImage: "url(/users/" + props.user.filename + ")" }
  return (
    <>
      <div className="profileimage" style={imageStyle} alt="" onClick={() => toggleMenu(!menuStatus)} />
      {Menu()}
    </>
  )
}
