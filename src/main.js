import * as React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import InputAdornment from '@material-ui/core/InputAdornment'
import Search from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import { Link } from '@material-ui/core';




const App = props => {
  console.log(props.histories)
  return (
    <Container>
      <StyledTextField
        placeholder='Search in your history and bookmarks'
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StyledSearch fontSize='large'/>
            </InputAdornment>
          ),
          style: { fontSize: 28 }
        }}
        fullWidth={true}
        autoFocus={true}
      />
      <StyledList component="nav">
        {props.histories.map((history, key) => {
          return (
          <ListItem button component='a' key={key} href={history.url}> 
            {history.title} 
          </ListItem>
        )})}
      </StyledList>
    </Container>
  )
}

const Container = styled.div`
  position: absolute;
  max-width: 580px;
  min-width: 200px;
  top: 20%;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 2147483647;
  /* * {
    color: white !important;
  } */
  background: #fff !important;
  max-height: 480px;
  overflow: scroll;
`

const StyledTextField = styled(TextField)`
  font-size: 34px !important;
  position: fixed !important;
  box-sizing: border-box;
  padding: 20px 0 10px 0 !important;
  color: white !important;
  background: #fff !important;
  z-index: 2147483646;
`

const StyledList = styled(Link)`
  background: #fff !important;
  color: white !important;
  margin-top: 46px;
  z-index: 2147483645;
`

const StyledSearch = styled(Search)`
  color: black !important;
`
// ReactDOM.render(<App />, document.getElementById('root'));

// class App extends React.Component {
//   render() {
//     console.log('render')
//     return (
//       <div> Your App injected to DOM correctly! </div>
//     )
//   }
// }

const injectApp = histories => {
  const div = document.createElement("div")
  div.setAttribute("id", "chromeExtensionReactApp")
  document.body.appendChild(div)
  ReactDOM.render(<App histories={histories} />, div)
}

const removeApp = () => {
  const element = document.getElementById("chromeExtensionReactApp")
  if (!element) return

  element.parentNode.removeChild(element)
}

let isAppShown = false
const handleKeydown = event => {
  if (event.key === 'Escape') {
    removeApp()
    isAppShown = false
    return
  }

  // cmd + p
  if (!event.shiftKey && (event.metaKey && event.keyCode === 80)) {
    event.preventDefault()

    if (isAppShown) {
      removeApp()
      isAppShown = false
      return
    }

    if (!isAppShown) {
      chrome.runtime.sendMessage({action: 'getHistories'}, response => {
        injectApp(response.histories)
      })
      isAppShown = true
    }
  }

  // cmd + shift + p
  if (event.metaKey && event.shiftKey && event.keyCode === 80) {
    event.preventDefault()
    console.log('cmd + shift + p !')
  }
}

window.addEventListener("keydown", handleKeydown)
