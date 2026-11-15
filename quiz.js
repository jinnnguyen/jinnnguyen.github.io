// Define correct answers key
const correctAnswers = {
    q1: "B",
    q2: "C",
    q3: "A",
    q4: ["A", "C", "D"], // Multi-select array
    q5: "javascript",    // Case-insensitive string check
    q6: "css",
    q7: "A",
    q8: "B",
    q9: "A",
    q10: "B"
};

let timerInterval;
let timeLeft = 600; // 10 minutes in seconds
let startTime = Date.now();

// Start countdown timer on load
window.onload = function() {
    startTimer();
};

function startTimer() {
    const timerDisplay = document.getElementById("time-left");
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time is up! Submitting your quiz automatically.");
            submitQuiz();
            return;
        }
        timeLeft--;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function submitQuiz() {
    clearInterval(timerInterval); // Stop timer
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutesSpent = Math.floor(timeSpentSeconds / 60);
    const secondsSpent = timeSpentSeconds % 60;

    const form = document.getElementById("quiz-form");
    const formData = new FormData(form);
    
    let score = 0;
    let totalQuestions = 10;
    let feedbackHTML = "";

    // Evaluate Q1 - Q3, Q7 - Q10 (Single Choice Radios)
    for (let i = 1; i <= 10; i++) {
        if (i === 4 || i === 5 || i === 6) continue; // Handled separately
        let qKey = `q${i}`;
        let userVal = formData.get(qKey);
        let isCorrect = userVal === correctAnswers[qKey];
        if (isCorrect) score++;

        feedbackHTML += `
            <div class="feedback-item ${isCorrect ? 'correct' : 'incorrect'}">
                <p><strong>Q${i}:</strong> Your answer: ${userVal || "None"} | Result: <strong>${isCorrect ? 'Correct' : 'Incorrect'}</strong> (Correct Answer: ${correctAnswers[qKey]})</p>
            </div>
        `;
    }

    // Evaluate Q4 (Multi-selection checkboxes)
    let userQ4 = formData.getAll("q4");
    // Sort and compare arrays
    let q4Correct = correctAnswers.q4.sort().toString() === userQ4.sort().toString();
    if (q4Correct) score++;
    feedbackHTML += `
        <div class="feedback-item ${q4Correct ? 'correct' : 'incorrect'}">
            <p><strong>Q4 (Multi-select):</strong> Your selections: ${userQ4.join(', ') || "None"} | Result: <strong>${q4Correct ? 'Correct' : 'Incorrect'}</strong> (Correct: A, C, D)</p>
        </div>
    `;

    // Evaluate Q5 (Fill in the blank)
    let userQ5 = formData.get("q5") ? formData.get("q5").trim().toLowerCase() : "";
    let q5Correct = userQ5 === correctAnswers.q5;
    if (q5Correct) score++;
    feedbackHTML += `
        <div class="feedback-item ${q5Correct ? 'correct' : 'incorrect'}">
            <p><strong>Q5 (Fill in blank):</strong> Your answer: "${formData.get("q5") || ""}" | Result: <strong>${q5Correct ? 'Correct' : 'Incorrect'}</strong> (Correct: JavaScript)</p>
        </div>
    `;

    // Evaluate Q6 (Fill in the blank)
    let userQ6 = formData.get("q6") ? formData.get("q6").trim().toLowerCase() : "";
    let q6Correct = userQ6 === correctAnswers.q6;
    if (q6Correct) score++;
    feedbackHTML += `
        <div class="feedback-item ${q6Correct ? 'correct' : 'incorrect'}">
            <p><strong>Q6 (Fill in blank):</strong> Your answer: "${formData.get("q6") || ""}" | Result: <strong>${q6Correct ? 'Correct' : 'Incorrect'}</strong> (Correct: CSS)</p>
        </div>
    `;

    // Calculate Pass/Fail (Threshold: 70% or 7/10)
    let percentage = (score / totalQuestions) * 100;
    let passed = percentage >= 70;

    // Display Results Banner
    const summaryBanner = document.getElementById("summary-banner");
    summaryBanner.innerHTML = `
        <h3 style="color: ${passed ? '#2e7d32' : '#c62828'};">
            Status: ${passed ? 'PASS 🎉' : 'FAIL ❌'}
        </h3>
        <p>Total Score: <strong>${score} / ${totalQuestions} (${percentage}%)</strong></p>
    `;

    document.getElementById("time-spent-display").textContent = 
        `Time Spent: ${minutesSpent} minute(s) and ${secondsSpent} second(s).`;

    document.getElementById("detailed-feedback").innerHTML = feedbackHTML;
    
    // Show results box & scroll to it
    const resultsSection = document.getElementById("results-section");
    resultsSection.classList.remove("hidden");
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    // Reset form fields
    document.getElementById("quiz-form").reset();
    
    // Hide results
    document.getElementById("results-section").classList.add("hidden");
    
    // Reset Timer
    clearInterval(timerInterval);
    timeLeft = 600;
    startTime = Date.now();
    startTimer();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
