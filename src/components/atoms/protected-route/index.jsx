import React from "react"
import { UserConsumer } from "../../../context-providers"
import { Route, Redirect } from "react-router-dom"

export default function ProtectedRoute(props) {
  const privileges = parseInt(props.privileges)

  return (
    <UserConsumer>
      {({ user }) => {
        const rendered =
          user.privileges >= privileges ? <Route path={props.path} component={props.component} /> : <Redirect to="/admin/login" state={{ redirect: props.path }}></Redirect>
        return rendered
      }}
    </UserConsumer>
  )
}
