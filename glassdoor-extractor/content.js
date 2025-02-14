// content.js
function extractInterviewQuestions() {
    const questions = [];
    document.querySelectorAll('[data-test="question-container"]').forEach(container => {
        let questionText = container.querySelector('.interview-details_interviewText__YH2ZO').innerText.trim();
        if (questionText.endsWith("more")) {
            questionText = questionText.slice(0, -9).trim();
        }
        console.log(`Question: ${questionText}`);
        questions.push(questionText);
    });
    return questions;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractQuestions") {
        const questions = extractInterviewQuestions();
        if (questions.length === 0) {
            sendResponse({error: "No interview questions found."});
            console.error("No interview questions found.");
            return;
        }
        sendResponse({questions});
    }
});