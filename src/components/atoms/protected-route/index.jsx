import React from "react"
import { UserConsumer } from "../../../context-providers"
import { Redirect } from "react-router-dom"

export default function ProtectedRoute(props) {
  const privileges = parseInt(props.privilege)
  return (
    <UserConsumer>
      {({ user, updateUser }) => {
        const rendered = user.privileges <= Number(privileges) ? props.children : <Redirect to="/admin/login"></Redirect>
        return rendered
      }}
    </UserConsumer>
  )
}
