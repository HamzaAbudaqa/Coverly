// background.js (MV3)

// 1) Keyboard command → ask user → dispatch page event via injected script
chrome.commands.onCommand.addListener((command) => {
  if (command !== "take-control") return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs?.[0];
    if (!tab?.id) {
      console.warn("No active tab to take control of.");
      return;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const ok = confirm("Should I take control?");
        if (ok) {
          // Content script listens for this:
          window.dispatchEvent(new CustomEvent("coverly-take-control"));
        }
      },
    });
  });
});

// 2) Single onMessage handler for all actions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message?.action) return;

  if (message.action === "saveFormData") {
    console.log("📨 Received form data:", message.data);

    chrome.storage.local.set({ formData: message.data, formDataSavedAt: Date.now() }, () => {
      console.log("📦 Saved formData to chrome.storage.local");
      // Debug read-back
      chrome.storage.local.get(["formData", "formDataSavedAt"], (result) => {
        console.log("📂 Stored value is now:", result.formData, " (savedAt:", new Date(result.formDataSavedAt).toLocaleString(), ")");
      });
      sendResponse({ success: true });
    });
    return true; // keep sendResponse alive (async)
  }

  // (optional) add more actions here later...
});
