import React, { useEffect } from "react"
import { UserConsumer } from "../../../context-providers"

export default function UserProfile(props) {
  return (
    <UserConsumer>
      {({ user, updateUser }) => {
        return (
          <button onClick={() => updateUser({})}>
            <p>{user.name}</p>
          </button>
        )
      }}
    </UserConsumer>
  )
}
