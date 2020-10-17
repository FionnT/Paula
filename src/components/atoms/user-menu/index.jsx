import React from "react"
import { Link } from "react-router-dom"
import { UserConsumer } from "../../../context-providers"
import "./styles.sass"

export default function UserMenu(props) {
  return (
    <>
      <p>
        <i className="las la-square-full"></i>
      </p>
      <div className="profilemenu">
        <ul>
          <li>
            <Link to="/admin/galleries">Galleries</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>

          <UserConsumer>
            {({ user }) => {
              return (
                <>
                  {user.privileges >= 1 ? (
                    <>
                      <li>
                        <Link to="/admin/shop">Shop</Link>
                      </li>
                      <li>
                        <Link to="/admin/users">Users</Link>
                      </li>
                    </>
                  ) : null}
                </>
              )
            }}
          </UserConsumer>
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
