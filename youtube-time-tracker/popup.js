document.addEventListener("DOMContentLoaded", function () {
    chrome.runtime.sendMessage({ action: "getTimeSpent" }, function (response) {
        let totalTime = response.totalTime || 0;
        let minutes = Math.floor(totalTime / 60);
        let seconds = totalTime % 60;
        document.getElementById("time").textContent = `${minutes}m ${seconds}s`;
    });
});
