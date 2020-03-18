// Sends a UI notification to the user
const pageNotification = (settings, duration) => {
  const length = duration ? duration : 2500
  const notifier = document.getElementById("notifier")
  notifier.className = settings[0]
  notifier.innerHTML = settings[1]
  notifier.style.opacity = 1
  setTimeout(() => {
    notifier.style.opacity = 0
  }, length)
}

export default pageNotification