// Variables
var firebaseRef = firebase.database();

$("#createAcc").click(function() {
  var email = $("#emailAcc").val();
  var remail = $("#remailAcc").val();
  var password = $("#passwordAcc").val();
  var repassword = $("#repasswordAcc").val();
  var username = $("#displayNameAcc").val();
  var birthdate = $("#birthdateAcc").val();
  var gender = $("select[name=gender] option:selected").text();

  if (remail != email){
    alert("Emails do not match!");
    $("#signUpErrorDisplay").html("Error: Emails do not match!");
    $("#signUpErrorDisplay").css({'background-color':'#fff9c4'})
    $("#signUpErrorDisplay").css("display", "block");
  }

  if (repassword != password){
    alert("Password do not match!")
    $("#signUpErrorDisplay").html("Error: Passwords do not match!");
    $("#signUpErrorDisplay").css({'background-color':'#fff9c4'})
    $("#signUpErrorDisplay").css("display", "block");
  }
});

$("#logInAcc").click(function() {
  var email = $("#logInAcc").val();
  var password = $("#logPassword").val();
  // Firebase Authentication will go here
});
