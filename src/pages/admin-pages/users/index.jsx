import React from "react"
import { Async } from "react-async"
import { UserConsumer } from "../../../context-providers/user-details"
import { AdminUserController } from "../../../components/organisms"

function Users() {
  const fetchAllUsers = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/users"
    return new Promise((resolve, reject) => {
      fetch(server, { credentials: "include", mode: "cors" }).then(res => resolve(res.json()))
    })
  }

  return (
    <UserConsumer>
      {({ cart, updateCart, availableItems, addItem, modifyAvailableItem, removeAvailableItem }) => {
        return (
          <Async promiseFn={fetchAllUsers}>
            {({ data, err, isLoading }) => {
              if (isLoading) return <img src="/loading.gif" className="loading-image" alt="Page is loading" />
              else
                return (
                  <AdminUserController
                    allUsers={data}
                    availableItems={availableItems}
                    addItem={addItem}
                    modifyAvailableItem={modifyAvailableItem}
                    removeAvailableItem={removeAvailableItem}
                  />
                )
            }}
          </Async>
        )
      }}
    </UserConsumer>
  )
}

export default Users
