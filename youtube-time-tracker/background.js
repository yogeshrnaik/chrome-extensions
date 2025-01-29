let isTracking = false;
let totalTime = 0;
let lastStartTime = null;
let activeTabId = null;

// Load saved time from storage
chrome.storage.local.get(["totalTime"], (data) => {
    totalTime = data.totalTime || 0;
});

// Function to start tracking time
function startTracking(tabId) {
    if (!isTracking) {
        lastStartTime = Date.now();
        isTracking = true;
        activeTabId = tabId;
    }
}

// Function to stop tracking time
function stopTracking() {
    if (isTracking && lastStartTime) {
        totalTime += Math.floor((Date.now() - lastStartTime) / 1000);
        lastStartTime = null;
        isTracking = false;

        // Save total time to storage
        chrome.storage.local.set({ totalTime });
    }
}

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab.url && tab.url.includes("youtube.com")) {
            startTracking(tab.id);
        } else {
            stopTracking();
        }
    });
});

// Listen for tab updates (in case YouTube is opened)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url.includes("youtube.com")) {
        startTracking(tabId);
    }
});

// Listen for window focus changes
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        stopTracking();
    } else {
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url.includes("youtube.com")) {
                startTracking(tabs[0].id);
            } else {
                stopTracking();
            }
        });
    }
});

// Message listener for popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getTimeSpent") {
        sendResponse({ totalTime });
    }
});
