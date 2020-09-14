// Just allows a central place to manage cookie paramaters
// For example, same site values etc.

import Cookies from "universal-cookie"
const cookies = new Cookies()

const get = name => {
  const result = cookies.get(name)
  if (result) return result
  else return false
}

const set = (name, value) => {
  cookies.set(name, value, { path: "/", SameSite: "lax", expires: new Date(Date.now() + 14400000) }) // 4 Hours
  return true
}

const Cookie = {
  get,
  set
}

export default Cookie
