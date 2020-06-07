import React from "react"
import { ErrorPage } from "../../components/atoms"
import { Navigation } from "../../components/organisms"

export default function NotFound() {
  return (
    <>
      <Navigation />
      <ErrorPage>Sorry, we couldn't find that page!</ErrorPage>
    </>
  )
}
