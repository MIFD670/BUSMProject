//Variables
var search_Username;
var search_Query = '?username=';
var currentURL = $(location).attr('href');
var firebaseRef = firebase.database();
$(document).ready(function(){
  //alert('Ready!');
  //var test = $(location).attr('href');
  //alert(test);
});

$('#search_Username').on('keyup', function(e) {
  if (e.keyCode === 13) {
    search_Username = $('#search_Username').val().toLowerCase();
    console.log('Selected username: ' + search_Username);
    if (search_Username.length > 3) {
      checkIfUserExists(search_Username);
    } else {
      $('#search_Error').html('Error: Username is too short.');
      $('#search_Error').css('display', 'block');
      $("#main_Container").animate({ scrollTop: 0 }, "slow");
    }
  }
});

function checkIfUserExists(userIdx) {
  //Checks to see if the user already exists
  var user = userIdx;
  var verify;
  console.log('Works here.');
  firebaseRef.ref('/Users/' + user).once('value', function(snapshot) {
    //If it exists mark it true
    if (snapshot.val() !== null) {
      verify = "true";
      console.log('Test');
      //If it does not, mark it false
    } else {
      verify = "false";
    }
    console.log('And here.');
    userExistsCallback(userIdx, verify);
  });
}

function userExistsCallback(userIdx, verifyIdx) {
  var user = userIdx;
  console.log(user);
  var checker = verifyIdx;
  if (checker == "false") {
    console.log('User does not exist.');
    $('#search_Error').html('Error: Username does not exist.');
    $('#search_Error').css('display', 'block');
    $("#main_Container").animate({ scrollTop: 0 }, "slow");
  } else if (checker == "true") {
    console.log('User exists, proceed.');
    window.location ='userProfile.html' + search_Query + search_Username;
  }
}
