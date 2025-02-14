// content.js
let allQuestions = [];
let allInterviewDetails = [];

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

function extractInterviewDetails() {
    const interviewDetails = [];
    document.querySelectorAll('[data-test^="Interview"][data-test$="Process"]').forEach(container => {
        let interviewText = container.querySelector('.interview-details_interviewText__YH2ZO').innerText.trim();
        if (interviewText.endsWith("more")) {
            interviewText = interviewText.slice(0, -9).trim();
        }
        console.log(`Interview Details: ${interviewText}`);
        interviewDetails.push(interviewText);
    });
    return interviewDetails;
}

function handlePageLoad() {
    const newQuestions = extractInterviewQuestions();
    const newInterviewDetails = extractInterviewDetails();
    if (newQuestions.length > 0) {
        allQuestions = [...new Set([...allQuestions, ...newQuestions])];
        chrome.runtime.sendMessage({ action: "updateQuestions", questions: allQuestions });
    }
    if (newInterviewDetails.length > 0) {
        allInterviewDetails = [...new Set([...allInterviewDetails, ...newInterviewDetails])];
        chrome.runtime.sendMessage({ action: "updateInterviewDetails", interviewDetails: allInterviewDetails });
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractQuestions") {
        handlePageLoad();
        sendResponse({ questions: allQuestions });
    }
    if (request.action === "extractInterviewDetails") {
        handlePageLoad();
        sendResponse({ interviewDetails: allInterviewDetails });
    }
});

window.addEventListener('load', handlePageLoad);
window.addEventListener('popstate', handlePageLoad);