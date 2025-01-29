function extractChessMoves() {
    let moves = [];

    document.querySelectorAll(".main-line-row").forEach(row => {
        let moveNumber = row.getAttribute("data-whole-move-number");
        let whiteMoveElement = row.querySelector(".white-move .node-highlight-content");
        let blackMoveElement = row.querySelector(".black-move .node-highlight-content");

        let whiteMove = "";
        if (whiteMoveElement) {
            let whitePiece = whiteMoveElement.querySelector(".icon-font-chess")?.getAttribute("data-figurine") || "";
            let whiteMoveText = whiteMoveElement.textContent.replace(whitePiece, "").trim();
            whiteMove = `${whitePiece}${whiteMoveText}`;
        }

        let blackMove = "";
        if (blackMoveElement) {
            let blackPiece = blackMoveElement.querySelector(".icon-font-chess")?.getAttribute("data-figurine") || "";
            let blackMoveText = blackMoveElement.textContent.replace(blackPiece, "").trim();
            blackMove = `${blackPiece}${blackMoveText}`;
        }

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