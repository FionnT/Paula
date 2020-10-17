import React from "react"
import { UserConsumer } from "../../../context-providers"
import { Route, Redirect } from "react-router-dom"

export default function ProtectedRoute(props) {
  const privileges = parseInt(props.privileges)

  return (
    <UserConsumer>
      {({ user }) => {
        const privileged = typeof user.privileges === "number" ? true : false
        if (!privileged) return <Redirect to="/admin/login" state={{ redirect: props.path }}></Redirect>
        else if (privileged && user.privileges < privileges) return <Redirect to="/unauthorised"></Redirect>
        else if (privileged && user.privileges >= privileges) return <Route {...props} />
      }}
    </UserConsumer>
  )
}
