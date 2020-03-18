// Verifies that there is a need to update the state of the calling component
// Resizes textarea input fields automatically to fit entered text

const validateText = (event, state, _callback) => {
  // The below isn't foolproof, but it's a close enough approximation
  const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const area = event.target
  const input = area.value
  const type = area.attributes.type.value
  state.valid = false
  state[type] = input

  const valid = valid => {
    if (valid) {
      area.dataset.valid = "true"
      area.style.borderBottom = ""
    } else {
      area.dataset.valid = "false"
      area.style.borderBottom = "1px solid red"
    }
  }

  const onTextAreaInput = () => {
    area.style.height = "auto"
    area.style.height = area.scrollHeight + "px"
  }

  switch (type) {
    case "name":
      valid(true)
      break
    case "email":
      if (isValidEmail.test(input)) valid(true)
      else valid(false)
      break
    case "password":
      if (input.length > 6) valid(true)
      else valid(false)
      break
    case "text":
      area.style.height = area.scrollHeight
      area.style.overflowY = "hidden"
      area.addEventListener("input", onTextAreaInput)
      if (input.length > 10) valid(true)
      else valid(false)
      break
    default:
      break
  }

  let validatedCount = 0
  let keyCount = Object.keys(state).length - 1

  for (let item in state) {
    if (item !== "valid") {
      let selector = '[type="' + item + '"]'
      let element = document.querySelectorAll(selector)[0]
      if (element.dataset.valid === "true") validatedCount += 1
    }
  }

  if (validatedCount === keyCount) state.valid = true
  else state.valid = false
  _callback(state)
}

export default validateText
