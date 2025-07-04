// content.js

// Normalize text by removing non-alphabetical characters and lowercasing
function normalize(text) {
  return text?.toLowerCase().replace(/[^a-z]/g, "") || "";
}

// Extract relevant info about all inputs and textareas on the page
function extractDomSnapshot() {
  const inputs = document.querySelectorAll("input, textarea");
  return Array.from(inputs).map((input) => {
    const id = input.id || "";
    const name = input.name || "";
    const placeholder = input.placeholder || "";
    const classList = [...input.classList];
    const labelEl = document.querySelector(`label[for="${id}"]`);
    const label = labelEl?.innerText || "";

    return { id, name, placeholder, classList, label };
  });
}

// Apply the mapping from GPT to DOM
function applyAutofillMapping(mapping) {
  for (const [selector, value] of Object.entries(mapping)) {
    const input = document.querySelector(selector);
    if (input) {
      input.value = value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
}

// Listen for user filling out form on your website
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.source !== "coverly-template") return;

  const formData = event.data.payload;
  chrome.runtime.sendMessage({ action: "saveFormData", data: formData }, (res) => {
    console.log("📦 Form data saved to extension storage:", res);
  });
});

// Main entry point: Ctrl+L triggers autofill flow
window.addEventListener("coverly-take-control", () => {
  console.log("✅ coverly-take-control event received!");

  chrome.storage.local.get("formData", (result) => {
    const userData = result.formData;
    if (!userData) {
      alert("⚠️ No template data found.");
      return;
    }

    const domSnapshot = extractDomSnapshot();
    const payload = {
      instruction: "Match each DOM field to the appropriate value from the user's form data. Return a JSON object where each key is the input `id` (prefixed with '#') and the value is what should be autofilled.",
      dom_snapshot: domSnapshot,
      user_data: userData,
    };

    console.log("🧠 Sending JSON to LLM planner:", payload);

    fetch("http://localhost:3002/autofill-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((mapping) => {
        console.log("✅ Mapping received from GPT:", mapping);
        applyAutofillMapping(mapping);
        alert("✅ Smart autofill complete!");
      })
      .catch((err) => {
        console.error("❌ GPT autofill failed:", err);
        alert("❌ Smart autofill failed.");
      });
  });
});
