import * as React from 'react'
import ReactDOM from 'react-dom'

// class App extends React.Component {
//   render () {
//     return <div>hello from function component</div>
//   }
// }

const App = () => (
  <div>hello from function component</div>
)

ReactDOM.render(<App />, document.getElementById('root'));

// class App extends React.Component {
//   render() {
//     console.log('render')
//     return (
//       <div> Your App injected to DOM correctly! </div>
//     )
//   }
// }

const injectApp = () => {
  console.log('inject')
  const div = document.createElement("div");
  div.setAttribute("id", "chromeExtensionReactApp");
  document.body.appendChild(div);
  ReactDOM.render(<App />, div);
}

const removeApp = () => {
  const element = document.getElementById("chromeExtensionReactApp")
  element.parentNode.removeChild(element)
}

let isAppShown = true
const handleKeydown = event => {
  // cmd + p
  if (!event.shiftKey && (event.metaKey && event.keyCode === 80)) {
    event.preventDefault()
    console.log('cmd + p !')
    isAppShown ? injectApp() : removeApp()
    isAppShown = !isAppShown
    return
  }

  // cmd + shift + p
  if (event.metaKey && event.shiftKey && event.keyCode === 80) {
    event.preventDefault()
    console.log('cmd + shift + p !')
  }
}

window.addEventListener("keydown", handleKeydown)
