function checkIfChatLoaded(callback) {
  const checkInterval = setInterval(() => {
    const chatElements = document.querySelectorAll("div[role='listitem']");
    if (chatElements.length > 0) {
      clearInterval(checkInterval); // Stop checking once chats are loaded
      callback(); // Call the provided callback function
    }
  }, 1000); // Check every second
}

// Listen for a message from the background script to start the polling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "START_POLLING") {
    checkIfChatLoaded(() => {
      // Once chats are loaded, send a message back to the background script
      chrome.runtime.sendMessage({ status: "CHATS_LOADED" });
    });
  }
});
