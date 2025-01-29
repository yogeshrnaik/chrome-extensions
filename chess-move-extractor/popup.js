document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getMoves" }, (response) => {
            document.getElementById("moves").textContent = response?.moves?.join("\n") || "No moves found.";
        });
    });
});
