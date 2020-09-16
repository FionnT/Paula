// Compares inputs of selected types against validation rules, which also function to
// verify that there is a need to update the state of the calling component
// Pass false for event, and pass a JSON blob if you need to check a collection of objects at once, state keys should be equal to value of the type prop of the element.
// Resizes textelement input fields automatically to fit entered text

const validateText = (event, collection, state, _callback, elementCount) => {
  // The below isn't foolproof, but it's a close enough approximation
  // eslint-disable-next-line
  const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  // Applies validation result
  const applyResult = (valid, element) => {
    if (valid) {
      element.dataset.valid = "true"
      element.style.borderBottom = ""
    } else {
      element.dataset.valid = "false"
      element.style.borderBottom = "1px solid red"
    }
  }

  // Resizes textarea elements to fit content
  const onTextAreaInput = element => {
    element.style.height = "auto"
    element.style.height = element.scrollHeight + "px"
  }

  const checkAgainstRules = element => {
    let input = element.value
    let type = element.attributes.type.value !== "password" ? element.attributes.type.value : element.attributes.name.value
    state[type] = input // Store input in state

    // Skip checking elements not marked as required
    if (!element.attributes.required) {
      applyResult(true, element)
      return
    }

    // Define your input rules here
    switch (type) {
      case "email":
        if (isValidEmail.test(input)) applyResult(true, element)
        else applyResult(false, element)
        break
      case "password":
        if (input.length > 6) applyResult(true, element)
        else applyResult(false, element)
        break
      case "text":
        element.style.height = element.scrollHeight
        element.style.overflowY = "hidden"
        element.addEventListener("input", onTextAreaInput(element))
        if (input.length > 10) applyResult(true, element)
        else applyResult(false, element)
        break
      default:
        if (input.length) applyResult(true, element)
        else applyResult(false, element)
        break
    }
  }

  if (event) checkAgainstRules(event.target)
  else if (collection) {
    Object.keys(collection).forEach(key => {
      if (key !== "valid") {
        let selector = '[type="' + key + '"]'
        let elements = document.querySelectorAll(selector)

        // Feel free to replace with a for loop, but state management might get messy
        if (elements.length > 1) throw new Error("Found multiple inputs of the same type (prop) in your collection. Assign a new type, or remove the secondary element.")
        checkAgainstRules(elements[0])
      }
    })
  } else return false

  let validatedCount = 0
  let keyCount = elementCount || Object.keys(state).length - 1
  for (let item in state) {
    if (item !== "valid") {
      let selector = '[type="' + item + '"]'
      let element = document.querySelectorAll(selector)[0]
      if (element && element.dataset.valid === "true") validatedCount += 1
    }
  }

  if (validatedCount === keyCount) state.valid = true
  else state.valid = false
  _callback(state)
}

export default validateText
