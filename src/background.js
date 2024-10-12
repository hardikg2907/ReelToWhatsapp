"use strict";

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SHARE_REEL") {
    const reelLink = message.payload.reelLink;

    // Get saved targetChat and targetNumber from Chrome storage
    chrome.storage.local.get(["targetChat", "targetNumber"], (data) => {
      const targetChat = data.targetChat; // Phone number
      const targetNumber = data.targetNumber; // Contact name

      // Check if WhatsApp Web is already open
      chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
        if (tabs.length > 0) {
          let whatsappTab = tabs[0];

          // Execute script to find and navigate to the chat
          chrome.scripting
            .executeScript({
              target: { tabId: whatsappTab.id },
              func: findAndNavigateToChat,
              args: [targetChat, reelLink],
            })
            .then(() => {
              sendResponse({ status: "Navigated to chat and reel link sent!" });
            });
        } else {
          chrome.tabs.create(
            { url: `https://web.whatsapp.com/send?phone=${targetNumber}` },
            (newTab) => {
              // setTimeout(() => {
              chrome.scripting
                .executeScript({
                  target: { tabId: newTab.id },
                  func: sendReelLink,
                  args: [reelLink],
                })
                .then(() => {
                  sendResponse({ status: "Reel link sent to WhatsApp!" });
                });
              // }, 15000); // Wait for WhatsApp Web to load
            }
          );
        }
      });

      return true; // Indicate async response
    });
  }
});

// Function to search for and click on the chat
function findAndNavigateToChat(targetNameOrPhone, reelLink) {
  const targetChat = document.querySelector(`[title="${targetNameOrPhone}"]`);

  if (targetChat) {
    // Simulate a click on the chat to navigate to it
    const mouseDownEvent = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
    });

    targetChat.dispatchEvent(mouseDownEvent);

    // Once chat is opened, send the reel link
    setTimeout(() => {
      let chatBox = document.querySelectorAll("[contenteditable='true']");
      chatBox = chatBox[chatBox.length - 1];
      if (chatBox) {
        chatBox.focus();
        document.execCommand("insertText", false, reelLink);

        setTimeout(() => {
          const sendButton = document.querySelector("span[data-icon='send']");
          if (sendButton) {
            sendButton.click(); // Simulate clicking the send button
          }
        }, 500);
      }
    }, 2000); // Wait for the chat to load
  } else {
    console.log("Target chat not found!");
  }
}

// Function to send the reel link in a new tab
function sendReelLink(reelLink) {
  const chatBox = document.querySelectorAll("[contenteditable='true']");
  chatBox = chatBox[chatBox.length - 1];
  if (chatBox) {
    chatBox.focus();
    document.execCommand("insertText", false, reelLink);

    setTimeout(() => {
      const sendButton = document.querySelector("span[data-icon='send']");
      if (sendButton) {
        sendButton.click(); // Simulate clicking the send button
      }
    }, 500);
  }
}
