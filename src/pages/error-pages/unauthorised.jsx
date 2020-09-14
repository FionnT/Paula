import React from "react"
import { ErrorPage } from "../../components/atoms"
import { Navigation } from "../../components/organisms"

export default function Unauthorised() {
  return (
    <>
      <Navigation />
      <ErrorPage>Sorry, you're not authorised to view that page!</ErrorPage>
    </>
  )
}
