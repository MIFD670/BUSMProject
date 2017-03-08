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

$('#showMore').on("click", function() {
  $('#older_announcements').css('display', 'block');
  $('#showMore').css('display', 'none');
  $('#showLess').css('display', 'block');
});
$('#showLess').on("click", function() {
  $('#older_announcements').css('display', 'none');
  $('#showMore').css('display', 'block');
  $('#showLess').css('display', 'none');

});
// Write Announcement
$('#write_Announcement').on("click", function() {
  //Local Variables
  var username = $('#announcement_user').val();
  var subject = $('#announcement_subject').val();
  var text = $('#announcement_message').val();
  var pinned;
  var checked = $('#filled-in-box').is(':checked');

  if (checked) {
    pinned = "True";
  } else {
    pinned = "False";
  }
  console.log(pinned);
  // This function creates the key and stores it in the Firebase database
  firebaseRef.ref('/Announcements').child(username).set({
    username: username,
    title: subject,
    message: text,
    pin: pinned,
    display_name: username
    // pic: user picture here
    // display_name: displayName
  });
  // Console logs
  console.log("CREATES Announcement: Announcer: " + username + ', Subject is ' + subject + ', Text is ' + text + ', Pinned?: is ' + pinned);
  $('#announcement_user').val('');
  // Remove once user is authenticated! ^
  $('#announcement_subject').val('');
  $('#announcement_message').val('');
  $(checked).removeAttr('selected ');
});
// Loops through the Firebase data on Announcements and then outputs each value
firebaseRef.ref('/Announcements').on("child_added", snap => {
  var subject = snap.child("title").val();
  var message = snap.child("message").val();
  var displayName = snap.child("display_name").val();
  var pinStatus = snap.child("pin").val();
  // Console log this to make sure
  console.log("1. " + subject + " 2. " + message + " 3. " + displayName);

  var newCard = $('#announcement_card').clone();
  newCard.removeAttr('id');
  newCard.find('.title').text(displayName);
  newCard.find('#subject').html(subject);
  newCard.find('#message').html(message);
  newCard.removeAttr('style');
  // Verifies if the card is pinned or not and displays it as so
  if (pinStatus == "True") {
    newCard.find('#logo').html('new_releases');
    newCard.find('#logo').addClass('red-text');
    $('#pinned_announcements').append(newCard);

  } else {
    newCard.find('#logo').html('message');
    $('#most_recent_announcements').append(newCard);
  };
  var cardNumber = $('div #most_recent_announcements .collection').length;
  console.log("Number of cards: " + cardNumber);
  $('#loader_section').css('display', 'none');
  $('#1').css('display', 'block');
  $('#2').css('display', 'block');
  if (cardNumber > 3) {
    $('#older_announcements').append(newCard);
  }
});
