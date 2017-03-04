// VARIABLES
var baseURL = "https://script.google.com/macros/s/AKfycbw49D3_9O7I8yi48PKmewF-XmqbzXEpylu-YjMGZYmmiehBewcA/exec";
var parameters = {};
var objCurrentQuestion, currentQuestionIndex = 0;
var quizNumQuestions = 3;
var questionData;
var chosenAnswer;
var numCorrect = 0;

$(document).ready(function() {
  getData();

  $('#answer1').click(function () {
    console.log($(this).val());
    chosenAnswer = $(this).val();
    processAnswer($(this).val());
  });
  $('#answer2').click(function () {
    console.log($(this).val());
    chosenAnswer = $(this).val();
    processAnswer($(this).val());
  });
  $('#answer3').click(function () {
    console.log($(this).val());
    chosenAnswer = $(this).val();
    processAnswer($(this).val());
  });
  $('#answer4').click(function () {
    console.log($(this).val());
    chosenAnswer = $(this).val();
    processAnswer($(this).val());
  });


});
// GET DATA FUNCTIONS
// Calls the data from the Google Spreadsheet
function getData() {
  $.ajax({
    url: baseURL,
    dataType: 'jsonp',
    jsonpCallback: 'processResponse',
    data: parameters
  }).done(function(data) {
    console.log(data);
    questionData = data;
    quizNumQuestions = data.length;
    console.log(quizNumQuestions);
    loadQuestionsPage();
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    alert("Request Failed: " + err);
    console.log("Request Failed: " + err);
  });
};

$('#alert').on("click", function() {
  loadQuestionsPage();
});

function loadQuestionsPage() {
  currentQuestionIndex = 0;
  displayQuestion(currentQuestionIndex);
};

function displayQuestion(intQuestionIndex) {
  objCurrentQuestion = questionData[intQuestionIndex];
  //alert(objCurrentQuestion);
  loadQuestion(objCurrentQuestion);
};
// DISPLAY DATA FUNCTION
function loadQuestion(objQuestion) {
  console.log(objQuestion);
  $("#question").html(objQuestion.Question);
  if (objQuestion['Ion Type'] == "Monatomic") {
    $('#ion').html('' + objQuestion.Symbol + '<sup>' + objQuestion.Strength + objQuestion.Charge + '<sup>');
  }
  $("#original").html("Select");
  $('#answer1').html("1. " + objQuestion.Answer1);
  $('#answer1').attr('value', objQuestion.Answer1);
  $('#answer2').html("2. " + objQuestion.Answer2);
  $('#answer2').attr('value', objQuestion.Answer2);
  $('#answer3').html("3. " + objQuestion.Answer3);
  $('#answer3').attr('value', objQuestion.Answer3)
  $('#answer4').html("3. " + objQuestion.Answer4);
  $('#answer4').attr('value', objQuestion.Answer4)
  $('#loader_section').css('display', 'none');
  $('#question_section').css('display', 'block');
};

// GET NUMBER OF QUESTIONS TO DISPLAY

// CHECK ANSWERS
function processAnswer(intAnswerIndex) {
  if (intAnswerIndex == objCurrentQuestion.CorrectAnswer) numCorrect++;
  else checkAnswer();
  currentQuestionIndex++;

  if (currentQuestionIndex < quizNumQuestions) displayQuestion(currentQuestionIndex);
  else console.log("The End...");
};

function checkAnswer(correctAnswer) {
  var correctAnswer = objCurrentQuestion.CorrectAnswer;
  var answerChosen = chosenAnswer;
  if (answerChosen == null) {
    answerChosen = "nothing";
  }
  alert("Oops, you got the answer wrong. The correct answer is " + correctAnswer + ", you selected " + answerChosen + " .");
};


//function loadSummaryPage() {}
