
const questionElement = document.getElementById("question");
const answerButton = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let cqi = 0;
let score = 0;
let questions = []; // Placeholder for fetched questions

// Fetch questions from an API (using Open Trivia Database API for this example)
async function fetchQuestions() {
    const url = "https://opentdb.com/api.php?amount=10&category=18&type=multiple"; // Example: Category 18 is 'Computers'
    const response = await fetch(url);
    const data = await response.json();
    
    // Transform API data to match the expected structure
    questions = data.results.map((q) => ({
        question: q.question,
        answer: [
            { text: q.correct_answer, correct: true },
            ...q.incorrect_answers.map(answer => ({ text: answer, correct: false }))
        ].sort(() => Math.random() - 0.5) // Shuffle answers
    }));

    StartQuiz();
}

function StartQuiz() {
    cqi = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let cq = questions[cqi];
    let qn = cqi + 1;
    questionElement.innerHTML = qn + ". " + cq.question;

    cq.answer.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButton.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState() {
    nextButton.style.display = "none";
    while (answerButton.firstChild) {
        answerButton.removeChild(answerButton.firstChild);
    }
}

function selectAnswer(e) {
    const selectBtn = e.target;
    const isCorrect = selectBtn.dataset.correct === "true";
    if (isCorrect) {
        selectBtn.classList.add("correct");
        score++;
    } else {
        selectBtn.classList.add("incorrect");
    }
    Array.from(answerButton.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore() {
    resetState();
    questionElement.innerHTML = `Your score is ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextBtn() {
    cqi++;
    if (cqi < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
}

nextButton.addEventListener("click", () => {
    if (cqi < questions.length) {
        handleNextBtn();
    } else {
        fetchQuestions(); // Restart the quiz with new questions from the API
    }
});

// Fetch questions on page load
fetchQuestions();
