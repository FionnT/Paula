import React from "react"
import { Async } from "react-async"
import { AdminUserList } from "../../../components/organisms"

function Users(props) {
  const fetchAllUsers = () => {
    let server = process.env.REACT_APP_API_URL + "/admin/users"
    return new Promise((resolve, reject) => {
      fetch(server, { credentials: "include", mode: "cors" }).then(res => resolve(res.json()))
    })
  }

  const updateHistory = location => props.history.push(location)

  return (
    <Async promiseFn={fetchAllUsers}>
      {({ data, err, isLoading }) => {
        if (isLoading) return <img src="/loading.gif" className="loading-image" alt="Page is loading" />
        else return <AdminUserList allUsers={data} updateHistory={updateHistory} />
      }}
    </Async>
  )
}

export default Users
