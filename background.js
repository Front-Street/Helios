/* Keep track of the active tab in each window */
var activeTabs = {};

chrome.tabs.onActivated.addListener(function(details) {
  activeTabs[details.windowId] = details.tabId;
});

/* Clear the corresponding entry, whenever a window is closed */
chrome.windows.onRemoved.addListener(function(winId) {
  delete activeTabs[winId];
});

/* Listen for web-requests and filter them */
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.tabId == -1) {
      console.log("Skipping request from non-tabbed context...");
      return;
    }

    var notInteresting = Object.keys(activeTabs).every(function(key) {
      if (activeTabs[key] == details.tabId) {
        /* We are interested in this request */
        console.log("Check this out:", details);
        return false;
      } else {
        return true;
      }
    });

    if (notInteresting) {
      /* We are not interested in this request */
      console.log("Just ignore this one:", details);
    }
  },
  { urls: ["<all_urls>"] }
);

/* Get the active tabs in all currently open windows */
chrome.tabs.query({ active: true }, function(tabs) {
  tabs.forEach(function(tab) {
    activeTabs[tab.windowId] = tab.id;
  });
  console.log("activeTabs = ", activeTabs);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!request.state.type && !request.state.devtoolsEnabled) {
    chrome.runtime.sendMessage({
      msg: "state_changed",
      data: {
        state: request.state
      }
    });
  }
});
