import React from "react"
import { UserConsumer } from "../../../context-providers"
import { Route, Redirect } from "react-router-dom"

export default function ProtectedRoute(props) {
  const privileges = parseInt(props.privileges)

  return (
    <UserConsumer>
      {({ user }) => {
        if (!user.privileges) return <Redirect to="/admin/login" state={{ redirect: props.path }}></Redirect>
        else if (user.privileges && user.privileges < privileges) return <Redirect to="/unauthorised"></Redirect>
        else if (user.privileges && user.privileges >= privileges) return <Route {...props} />
      }}
    </UserConsumer>
  )
}
