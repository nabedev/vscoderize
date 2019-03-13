chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'getHistories') return
  chrome.history.search({text: '', maxResults: 50}, function(data) {
    sendResponse({ histories: data })
  })
  return true
})

