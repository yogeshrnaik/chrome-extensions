// popup.js
document.addEventListener("DOMContentLoaded", () => {
    console.log("Extracting questions...");
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractQuestions" }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Error extracting questions:", chrome.runtime.lastError.message);
                    return;
                }
                const questionsList = document.getElementById('questions');
                questionsList.innerHTML = '';
                if (response.questions && response.questions.length > 0) {
                    const questionsText = response.questions.join('\n');
                    response.questions.forEach(question => {
                        const li = document.createElement('li');
                        li.textContent = question;
                        questionsList.appendChild(li);
                    });

                    navigator.clipboard.writeText(questionsText).then(() => {
                        console.log("Questions copied to clipboard.");
                    }).catch(err => {
                        console.error("Failed to copy questions to clipboard:", err);
                    });
                } else {
                    questionsList.textContent = "No questions found.";
                }
            });
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
});