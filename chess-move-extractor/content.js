function extractChessMoves() {
    let moves = [];

    document.querySelectorAll(".main-line-row").forEach(row => {
        let moveNumber = row.getAttribute("data-whole-move-number");
        let whiteMove = row.querySelector(".white-move span")?.textContent.trim() || "";
        let blackMove = row.querySelector(".black-move span")?.textContent.trim() || "";

        if (moveNumber) {
            moves.push(`${moveNumber}. ${whiteMove} ${blackMove}`);
        }
    });

    return moves;
}

// Send moves to the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMoves") {
        sendResponse({ moves: extractChessMoves() });
    }
});
