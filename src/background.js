chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getHistories') {
    chrome.history.search({text: '', startTime: 0, maxResults: 1000}, function(data) {
      sendResponse({ histories: data })
    })
  }

  if (request.action === 'closeOtherTab') {
    chrome.tabs.query({}, tabs => {
      console.log('background')
      chrome.tabs.getSelected(currentTab => {
        chrome.tabs.remove(tabs.filter(tab => tab.index !== currentTab.index).map(tab => tab.id))
      })
    })
  }

  if (request.action === 'closeRightTab') {
    chrome.tabs.query({}, tabs => {
      console.log(tabs)
      chrome.tabs.getSelected(currentTab => {
        chrome.tabs.remove(tabs.filter(tab => tab.index > currentTab.index).map(tab => tab.id))
      })
    })
  }

  if (request.action === 'closeLeftTab') {
    chrome.tabs.query({}, tabs => {
      chrome.tabs.getSelected(currentTab => {
        chrome.tabs.remove(tabs.filter(tab => tab.index < currentTab.index).map(tab => tab.id))
      })
    })
  }
  return true
})

