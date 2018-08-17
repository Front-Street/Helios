window.addEventListener("message", function(event) {
  if (event.source != window) return;
  // Make sure we're only capturing messages from the same domain as our events origin
  if (
    window.location.href === event.origin ||
    window.location.href.slice(0, -1) === event.origin
  ) {
    chrome.runtime.sendMessage({ type: "currentState", state: event.data });
  }
});
