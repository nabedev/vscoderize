import * as React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import Fuse from 'fuse.js'
import fuzzysort from 'fuzzysort'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import Search from '@material-ui/icons/Search'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'

let defaultHistories
const defaultCommands = [
  {
    command: 'Close Other Tab',
    excute: () => {
      chrome.runtime.sendMessage({action: 'closeOtherTab'}, () => {})
    }
  },
  {
    command: 'CLose to the Right Tab',
    excute: () => {
      chrome.runtime.sendMessage({action: 'closeRightTab'}, () => {})
    }
  },
  {
    command: 'CLose to the Left Tab',
    excute: () => {
      chrome.runtime.sendMessage({action: 'closeLeftTab'}, () => {})
    }
  },
]

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      listItems: props.listItems,
      activeIndex: 0,
      mode: props.mode
    }
  }

  render () {
    const { listItems, activeIndex, mode } = this.state
    return (
      <Container mode={mode}>
        <StyledInput
          placeholder="search or type '>' to change command mode"
          inputProps={{
            'aria-label': 'Description',
          }}
          fullWidth={true}
          autoFocus={true}
          style={{fontSize: 24, padding: 12}}
          onChange={(event) => this.filterListItems(event)}
          onKeyDown={(event) => this.onKeyDown(event)}
        />
        <ListContainer>
          {listItems.map((item, key) => {
            return this.state.mode === 'search'
            ?
              <StyledListItem button component='a' key={key} href={item.url} selected={activeIndex === key}>
                <div  dangerouslySetInnerHTML={{__html: item.title}} />
                <br />
                <div  dangerouslySetInnerHTML={{__html: item.url}} />
              </StyledListItem>
            :
              <StyledListItem button key={key} selected={activeIndex === key}>
                <div  dangerouslySetInnerHTML={{__html: item.command}} />
              </StyledListItem>
          })}
        </ListContainer>
      </Container>
    )
  }

  onKeyDown (event) {
    // ⬆︎
    if (event.keyCode === 38) {
      this.state.activeIndex - 1 < 0
      ? this.setState({ activeIndex: this.state.listItems.length - 1 })
      : this.setState({ activeIndex: this.state.activeIndex - 1 })
    }
  
    // ⬇︎
    if (event.keyCode === 40) {
      this.state.activeIndex + 1 >= this.state.listItems.length
      ? this.setState({ activeIndex: 0 })
      : this.setState({ activeIndex: this.state.activeIndex + 1 })
    }
  
    // Enter
    if (event.keyCode === 13) {
      if (!this.state.listItems.length) return
      if (this.state.mode === 'search') {
        window.location.href = this.state.listItems[this.state.activeIndex].url
        return
      }
      if (this.state.mode === 'command') {
        this.state.listItems[this.state.activeIndex].excute()
        removeApp()
      }
    }
  }

  filterListItems (event) {
    // change to command mode
    if (event.target.value === '>') {
      this.setState({ mode: 'command', listItems: defaultCommands.slice(0, 10), activeIndex: 0 })
      return
    }
  
    // change to search mode
    if (this.state.mode === 'command' && event.target.value === '') {
      this.setState({ mode: 'search', listItems: defaultHistories.slice(0, 10), activeIndex: 0 })
      return
    }
  
    const options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: this.state.mode === 'search' ? ['title', 'url'] : ['command']
    }
  
    const searchItems = this.state.mode === 'search' ? defaultHistories : defaultCommands
    // const fuse = new Fuse(searchItems, options)

    let searchKeyword
    searchKeyword = this.state.mode === 'command' ? event.target.value.slice(1) : event.target.value

    if (this.state.mode === 'search') {
      let results = fuzzysort.go(searchKeyword, searchItems, { keys: ['title', 'url'] }).slice(0, 20)
      const shapedResutl =  results.map(result => {
        return {
          title: fuzzysort.highlight(result[0], '<b style="color: yellow !important;">', '</b>'),
          urlText: fuzzysort.highlight(result[1], '<b style="color: yellow !important;">', '</b>'),
          url: result.obj.url
        }
      })
      this.setState({ listItems: shapedResutl })
      return
    }

    if (this.state.mode === 'command') {
      let results = fuzzysort.go(searchKeyword, searchItems, { keys: ['command'] }).slice(0, 20)
      console.log(results)
      const shapedResutl =  results.map(result => {
        return {
          command: fuzzysort.highlight(result[0], '<b>', '</b>'),
          excute: result.obj.excute
        }
      })
      this.setState({ listItems: shapedResutl })
      return
    }
    // console.log(fuzzysort.highlight(result, '<b>', '</b>'))


    // console.log(fuse.search(searchKeyword))
    // if (searchKeyword === '') {
    //   this.setState({ listItems: defaultHistories.slice(0, 10), activeIndex: 0 })
    //   return
    // }
    // this.setState({ listItems: fuse.search(searchKeyword).slice(0, 10), activeIndex: 0 })
  }
}

const Container = styled.div`
  position: absolute;
  max-width: 580px;
  min-width: 200px;
  border-radius: 6px;
  top: 20%;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 2147483647;
  * {
    color: ${props => `${props.mode === 'search' ? 'white' : '#00FF41'} !important`};
  }
  background: #444f5a !important;
  max-height: 480px;
  overflow: scroll;
  box-shadow: -9px 46px 165px -13px rgba(0,0,0,0.38);
`

const StyledTextField = styled(TextField)`
  font-size: 34px !important;
  position: fixed !important;
  box-sizing: border-box;
  padding: 20px 0 10px 0 !important;
  color: #eeeeee !important;
  background: #444f5a !important;
  z-index: 2147483646;
`

const ListContainer = styled.div`
  padding-top: 66px;
  z-index: 2147483645;
`

const StyledList = styled(Link)`
  background: #fff !important;
  color: white !important;
  padding: 80px 0 0 0 !important;
  z-index: 2147483645;
`

const StyledInput = styled(Input)`
  position: fixed !important;
  border-bottom: solid 1px rgba(255, 255, 255, 0.5);
  background: #444f5a !important;
  z-index: 2147483646;

  &::after {
    transition: none !important;
    border-bottom: none !important;
  }
  &::before {
    transition: none !important;
    border-bottom: none !important;
  }
`

const StyledListItem = styled(ListItem)`
  transition: none !important;
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
  ReactDOM.render(<App listItems={histories} mode='search' />, div)
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
        defaultHistories = response.histories
        injectApp(defaultHistories.slice(0, 10))
        isAppShown = true
      })
    }
  }

  // cmd + shift + p
  if (event.metaKey && event.shiftKey && event.keyCode === 80) {
    event.preventDefault()
    // TODO open in command mode or change command mode
  }
}

window.addEventListener("keydown", handleKeydown)
