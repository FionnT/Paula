import React from "react"
import { Link } from "react-router-dom"
import "./styles.sass"

export default function UserMenu(props) {
  return (
    <>
      <p>
        <i class="las la-square-full"></i>
      </p>
      <div className="profilemenu">
        <ul>
          <li>
            <Link to="/admin/galleries">Galleries</Link>
          </li>
          {/* <li>
            <Link to="/admin/users">Users</Link>
          </li> */}
          <li>
            <Link to="/admin/shop">Shop</Link>
          </li>
          <li>
            <Link to="/" onClick={() => props.updateUser({})}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}
