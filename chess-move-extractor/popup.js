document.addEventListener("DOMContentLoaded", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                files: ['content.js']
            },
            () => {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError.message);
                    return;
                }
                chrome.tabs.sendMessage(tabs[0].id, { action: "getMoves" }, (response) => {
                    const movesElement = document.getElementById("moves");
                    movesElement.textContent = response?.moves?.join("\n") || "No moves found.";
                });
            }
        );
    });

    document.getElementById("copyIcon").addEventListener("click", () => {
        const movesText = document.getElementById("moves").textContent;
        navigator.clipboard.writeText(movesText).then(() => {
            showTemporaryMessage("Moves copied to clipboard!");
        }).catch(err => {
            console.error("Failed to copy moves: ", err);
        });
    });
});

function showTemporaryMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.position = "fixed";
    messageElement.style.bottom = "10px";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translateX(-50%)";
    messageElement.style.backgroundColor = "#4CAF50";
    messageElement.style.color = "white";
    messageElement.style.padding = "10px";
    messageElement.style.borderRadius = "5px";
    messageElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    document.body.appendChild(messageElement);

    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 2000);
}