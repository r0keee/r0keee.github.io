const questions = [
    {
        question: "When did season 6 start?",
        answers: [
            { text: "20.06.22", correct: false},
            { text: "24.06.22", correct: true},
            { text: "24.07.22", correct: false},
            { text: "20.06.21", correct: false},
        ]
    },
    {
        question: "How many seasons did ReBirth have?",
        answers: [
            { text: "7", correct: false},
            { text: "6", correct: false},
            { text: "10", correct: false},
            { text: "9", correct: true},
        ]
    },
    {
        question: "Which of these branches did NOT exist?",
        answers: [
            { text: "ReBirth Terraria", correct: true},
            { text: "ReBirth Mods", correct: false},
            { text: "ReBirth Vanilla", correct: false},
            { text: "ReBirth MiniGames", correct: false},
        ]
    },
    {
        question: "What year did ReBirth appear?",
        answers: [
            { text: "2020", correct: true},
            { text: "2019", correct: false},
            { text: "2021", correct: false},
            { text: "2022", correct: false},
        ]
    },
    {
        question: "What was the peak online at ReBirth 6?",
        answers: [
            { text: "7", correct: false},
            { text: "8", correct: true},
            { text: "9", correct: false},
            { text: "10", correct: false},
        ]
    },
    {
        question: "Which of these players has never been on ReBirth?",
        answers: [
            { text: "MauG", correct: true},
            { text: "MISTERSAS", correct: false},
            { text: "Molites", correct: false},
            { text: "KVIINK", correct: false},
        ]
    },
    {
        question: "On which hosting did the first two seasons of the server exist?",
        answers: [
            { text: "Craft-Host", correct: false},
            { text: "SRVGame", correct: false},
            { text: "BisectHosting", correct: false},
            { text: "Minecraft Realms", correct: true},
        ]
    },
    {
        question: "What year did the discord community appear?",
        answers: [
            { text: "2021", correct: true},
            { text: "2020", correct: false},
            { text: "2022", correct: false},
            { text: "2019", correct: false},
        ]
    },
    {
        question: "Which core has NEVER been used on the server?",
        answers: [
            { text: "Vanilla", correct: false},
            { text: "Paper", correct: false},
            { text: "Velocity", correct: true},
            { text: "Fabric", correct: false},
        ]
    },
    {
        question: "Which of these people has ever been a server administrator",
        answers: [
            { text: "Foler123", correct: true},
            { text: "UfallaXD", correct: false},
            { text: "Cyber_Tr0tsky", correct: false},
            { text: "Cbgt", correct: false},
        ]
    }
];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + "/" + questions.length + ". " + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
    });
}

function resetState(){
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if (isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true"){
            button.classList.add("correct");
        }
        button.disabled = true;
    });
    nextButton.style.display = "block";
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Again";
    nextButton.style.display = "block";
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

startQuiz();