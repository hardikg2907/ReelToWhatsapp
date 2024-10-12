"use strict";

// Function to get the Instagram reel link from the current active tab
function getReelLink(cb) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const reelLink = currentTab.url; // Get the current tab's URL
    cb(reelLink);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the saved target chat and number from Chrome storage
  chrome.storage.local.get(["targetChat", "targetNumber"], (data) => {
    const targetChat = data.targetChat;
    const targetNumber = data.targetNumber;

    // Set the saved values to the input fields
    document.getElementById("targetChat").value = targetChat;
    document.getElementById("targetNumber").value = targetNumber;
    document.getElementById("share").innerText = `Share with ${targetChat}`;
  });
});

// Event listener for saving target chat and number
document.getElementById("save").addEventListener("click", () => {
  const targetNumber = document.getElementById("targetNumber").value;
  const targetChat = document.getElementById("targetChat").value;

  // Save the values to Chrome storage
  chrome.storage.local.set({ targetNumber, targetChat }, () => {
    alert("Target chat and number saved!");
  });
});

// Event listener for the "share" button click
document.getElementById("share").addEventListener("click", () => {
  getReelLink((reelLink) => {
    // Retrieve targetChat and targetNumber from Chrome storage
    chrome.storage.local.get(["targetChat", "targetNumber"], (data) => {
      const targetChat = data.targetChat; // Phone number
      const targetNumber = data.targetNumber; // Contact name

      // Send the reel link along with targetChat and targetNumber to the background script
      chrome.runtime.sendMessage({
        type: "SHARE_REEL",
        payload: { reelLink, targetChat, targetNumber },
      });
    });
  });
});
