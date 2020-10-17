import React from "react"
import { AdminUserController, Navigation } from "../../../components/organisms"

const UserController = props => {
  return (
    <>
      <Navigation />
      <div id="store-container" className="admin user-manage">
        <AdminUserController userid={props.match.params.userid} />
      </div>
    </>
  )
}
export default UserController
