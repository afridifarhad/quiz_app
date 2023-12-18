const apiUrl = 'https://opentdb.com/api.php?amount=1'; // Adjust amount for number of questions

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('btn');

let currentQuestionIndex = 0;
let questions = [];

// Fetch questions from API
async function fetchQuestions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    questions = data.results;
    displayQuestion();
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Display question and options
function displayQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.innerHTML = currentQuestion.question;

  const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
  optionsContainer.innerHTML = '';

  options.sort(() => Math.random() - 0.5); // Shuffle options

  options.forEach((option) => {
    const button = document.createElement('button');
    button.innerText = option;
    button.classList.add('btn', 'btn-secondary', 'mr-2');
    button.addEventListener('click', selectAnswer);
    optionsContainer.appendChild(button);
  });
}

// Handle option selection
function selectAnswer(event) {
  const selectedOption = event.target.innerText;
  const currentQuestion = questions[currentQuestionIndex];
  const correctAnswer = currentQuestion.correct_answer;

  if (selectedOption === correctAnswer) {
    event.target.classList.add('btn-success');
  } else {
    event.target.classList.add('btn-danger');
    // Highlight the correct answer
    optionsContainer.querySelectorAll('button').forEach((button) => {
      if (button.innerText === correctAnswer) {
        button.classList.add('btn-success');
      }
    });
  }

  disableOptions();
  showNextButton();
}

// Disable option buttons after selection
function disableOptions() {
  optionsContainer.querySelectorAll('button').forEach((button) => {
    button.disabled = true;
  });
}

// Show next button
function showNextButton() {
  nextButton.style.display = 'block';
}

// Event listener for next button click
nextButton.addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
    resetOptions();
  } else {
    // Quiz finished
    alert('Quiz finished!');
    currentQuestionIndex = 0;
    fetchQuestions();
    resetOptions();
    nextButton.style.display = 'none';
  }
});

// Reset options for the next question
function resetOptions() {
  optionsContainer.innerHTML = '';
}

// Start the quiz by fetching questions
fetchQuestions();
