// background.js

// Listen for command shortcuts defined in manifest.json
chrome.commands.onCommand.addListener((command) => {
  // Check if the command matches our custom "take-control"
  if (command === "take-control") {
    // Get the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      // Dynamically inject and execute a script into the active tab
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Ask the user for permission to take control
          const shouldTakeControl = confirm("Should I take control?");
          
          // If user says "OK", dispatch a custom event on the page
          if (shouldTakeControl) {
            window.dispatchEvent(new CustomEvent("coverly-take-control"));
          }
        },
      });
    });
  }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveFormData') {
    chrome.storage.local.set({ formData: message.data }, () => {
      console.log("📦 Stored formData from React app:", message.data);
      sendResponse({ success: true });
    });

    // Required to return response asynchronously
    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveFormData') {
    console.log("📨 Received form data:", message.data);

    chrome.storage.local.set({ formData: message.data }, () => {
      console.log("📦 Saved formData to chrome.storage.local");

      // Debug print after saving
      chrome.storage.local.get("formData", (result) => {
        console.log("📂 Stored value is now:", result.formData);
      });

      sendResponse({ success: true });
    });

    return true;
  }
});


