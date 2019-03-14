chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action !== 'getHistories') return
  chrome.history.search({text: '', startTime: 0, maxResults: 1000}, function(data) {
    sendResponse({ histories: data })
  })
  return true
})

