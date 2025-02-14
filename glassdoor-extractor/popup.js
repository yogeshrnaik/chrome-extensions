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
                updateQuestionsList(response.questions);
            });
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateQuestions") {
        updateQuestionsList(request.questions);
    }
    if (request.action === "updateInterviewDetails") {
        updateInterviewDetailsList(request.interviewDetails);
    }
});

function updateQuestionsList(questions) {
    const questionsList = document.getElementById('questions');
    questionsList.innerHTML = '';
    if (questions && questions.length > 0) {
        const questionsText = questions.join('\n');
        questions.forEach(question => {
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
}

function updateInterviewDetailsList(interviewDetails) {
    const interviewDetailsList = document.getElementById('interviewDetails');
    interviewDetailsList.innerHTML = '';
    if (interviewDetails && interviewDetails.length > 0) {
        const interviewDetailsText = interviewDetails.join('\n');
        interviewDetails.forEach(interviewDetail => {
            const li = document.createElement('li');
            li.textContent = interviewDetail;
            interviewDetailsList.appendChild(li);
        });

        navigator.clipboard.writeText(interviewDetailsText).then(() => {
            console.log("Interview details copied to clipboard.");
        }).catch(err => {
            console.error("Failed to copy interview details to clipboard:", err);
        });
    } else {
        interviewDetailsList.textContent = "No interview details found.";
    }
}