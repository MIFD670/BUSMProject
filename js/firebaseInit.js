//Account Types:
//Normal -> Forces Command, etc -> class="normal" (.normal)
//Moderator -> Moderators -> class="mod" (.mod)
//Administrator -> Admin -> class="admin" (.admin)
//Owner -> Owner -> class="owner" (.owner)

// Global Variables
var firebaseRef = firebase.database();
var username;
var paygrade;
var branch;
var rank;
var email;
var currentUnit;
var imageURL;
var profileID;
var profileImageURL;
var errorCode;
var errorMessage;
var errorBlockquote;
var endText = '&format=json';
var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
var robloxBaseURL = 'https://api.roblox.com/users/get-by-username?username=';
var robloxImageURL = 'https://www.roblox.com/headshot-thumbnail/image?userId=';
var robloxImageURLEnd = '&width=420&height=420&format=png';
var userKey;

$(document).ready(function() {
  console.log('FirebaseInit script enabled!');
  $("#sign_Up_Paygrade").prop('selectedIndex', 0);
  $("#sign_Up_Paygrade").material_select();
  $("#sign_Up_Branch").prop('selectedIndex', 0);
  $("#sign_Up_Branch").material_select();
  $('#sign_Up_Error').val('');
  $('#sign_Up_Error').css('display', 'none');
  $('#sign_Up_Error_Follow').val('');
  $('#sign_Up_Error_Follow').css('display', 'none');
  console.log('All fields cleared');
  //$('#sign_Up_Trigger').css('display', 'none');
  initApp();
});

function initApp() {
  //Listen for auth state changes
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user);
      var currentUser = firebase.auth().currentUser.displayName;
      console.log('Currently logged in: ' + currentUser.toLowerCase());
      //Get Admin data from Firebase
      firebase.database().ref('/Users/' + currentUser.toLowerCase()).once('value').then(function(snapshot) {
        var userAdmin = snapshot.child('admin').val();
        var paygrade = snapshot.child('paygrade').val();
        var branchForSimpleRank = snapshot.child('branch').val();
        var simplifiedRank = getSimpleRank(paygrade, branchForSimpleRank);
        console.log('Current User Admin: ' + userAdmin);
        var text1 = simplifiedRank + ' ' + currentUser;
        console.log(simplifiedRank + '?');
        var text2 = '<i class="material-icons right">arrow_drop_down</i>';
        var text;
        console.log('The length of text 1 is ' + text1.length);
        if (text1.length > 18) {
          text = text1.substring(0, 18) + '..';
        } else {
          console.log('Text meets the limit');
          text = text1;
        }
        if ((userAdmin == "owner") || (userAdmin == "superAdmin") || (userAdmin == "admin") || (userAdmin == "mod") || (userAdmin == "normal")) {
          console.log('Has the needed admin');
          console.log('Text: ' + text + text2)
          $('#admin_Btn_Text').html(text + text2);
          $('#admin_Btn_Text_SideNav').html(text);
          $('#admin_Email_Text_SideNav').html(firebase.auth().currentUser.email);
          $('#profile_Picture_SideNav').attr('src', firebase.auth().currentUser.photoURL);
          $('.normal').css('display', 'block');
          $('.normal').removeClass("disabled");
          if ((userAdmin == "owner") || (userAdmin == "admin") || (userAdmin == "mod")) {
            $('.normal').css('display', 'block');
            $('.normal').removeClass("disabled");
            $('.mod').css('display', 'block');
            $('.mod').removeClass("disabled");
          }
          if ((userAdmin == "owner") || (userAdmin == "superAdmin") || (userAdmin == "admin")) {
            $('.normal').css('display', 'block');
            $('.normal').removeClass("disabled");
            $('.mod').css('display', 'block');
            $('.mod').removeClass("disabled");
            $('.admin').css('display', 'block');
            $('.admin').removeClass("disabled");
          }
          if ((userAdmin == "owner") || (userAdmin == "superAdmin")) {
            $('.normal').css('display', 'block');
            $('.normal').removeClass("disabled");
            $('.mod').css('display', 'block');
            $('.mod').removeClass("disabled");
            $('.admin').css('display', 'block');
            $('.admin').removeClass("disabled");
            $('.superAdmin').css('display', 'block');
            $('.superAdmin').removeClass("disabled");
          }
          $('#sign_In_Nav_Btn').css('display', 'none');
          $('#sign_In_Nav_Btn_SideNav').css('display', 'none');
          $('#admin_Btn').css('display', 'block');
        } else if (userAdmin == ('none' || null)) {
          console.log('Does not have the needed admin!');
        }
      });

    } else {
      console.log('User is not signed in.');
      $('#admin_Btn').css('display', 'none');
      $('#admin_Btn_Text').html('');
      $('#sign_In_Nav_Btn').css('display', 'block');
      $('#sign_In_Nav_Btn_SideNav').css('display', 'block');
      //$('#sign_In_Nav_Btn_Link').attr('href', '#sign_In');
    }
  });
  // Listen for announcements
  firebaseRef.ref('/Announcements/').on("child_added", snap => {
    var key = snap.key;
    var username = capitalizeFirstLetter(snap.child('username').val());
    var date = snap.child('date').val();
    var message = snap.child('message').val();
    var color = snap.child('color').val();
    var type;

    if (color == "#fb8c00") {
      type = "Normal";
    } else if (color == "#e53935") {
      type = "Important";
    } else {
      type = "Unknown";
    }
    // Console logs
    console.log('Message: ' + message + ', ' +  ', color: ' + color);
    // Creates a clone of the template to edit
    var newMessage;
    if (type == "Important") {
      newMessage = $('#announcement_important').clone();
    } else if (type == "Normal") {
      newMessage = $('#announcement_normal').clone();
    } else if (type == "Unknown") {
      newMessage = $('#announcement_normal').clone();
    }
    newMessage.removeAttr('id');
    newMessage.text(message);
    newMessage.css('display', '');
    $('#announcement').append(newMessage);
    $('#announcement').css('display', 'block');
  });
}
// Sign in
$('#sign_In_Nav_Btn_Link_SideNav').on("click", function() {
  console.log('Clear!');
  $('#sign_In_Error').html('');
  $('#sign_In_Error').css('display', 'none');
  $('#sign_In_Email').val('');
  $('#sign_In_Password').val('');
  $('#codeVerifier').css('display', 'none');
  // Hide sideNav
  $('#slide-out').sideNav('hide');
  $('#sign_In').modal('open');
});

$('#sign_In_Nav_Btn_Link').on("click", function() {
  console.log('Clear!');
  $('#sign_In_Error').html('');
  $('#sign_In_Error').css('display', 'none');
  $('#sign_In_Email').val('');
  $('#sign_In_Password').val('');
  $('#codeVerifier').css('display', 'none');
  $('#sign_In').modal('open');
});
// Sign up
$('#sign_Up_Trigger').on("click", function() {
  $('#verify_Error').html('');
  $('#verify_Error').css('display', 'none');
  console.log('Opening verifier.');
  $('#codeVerifier').css('display', 'block');
});
// Code verifier
$('#code_Verification_Btn').on("click", function() {
  var code = $('#verification_Input').val();

  firebaseRef.ref('/ServerSettings/verifyCode').once('value').then(function(snapshot) {
    var verifier = snapshot.val();
    if ((code < 5) || (code == null)) {
      $('#verify_Error').html('Error: Verification code is not valid.');
      $('#verify_Error').css('display', 'block');
      return;
    }
    if (code !== verifier) {
      $('#verify_Error').html('Error: Verification code does not match the code we have in record. Please try again.');
      $('#verify_Error').css('display', 'block');
      return;
    } else if (code == verifier) {
      console.log('Went through');
      console.log('Clear 1!');
      $('#sign_Up_Error').html('');
      $('sign_Up_Error').css('display', 'none');
      $('#sign_Up_Email').val('');
      $('#sign_Up_Password').val('');
      $('#sign_Up_Password_Verify').val('');
      $('#sign_In').modal('close');
      $('#sign_Up').modal('open');
    }
  });
  $('#verification_Input').val('');
});
// Transfer
$('#transfer_Send_Btn').on("click", function() {
  var username = $('#transfer_Username').val().toLowerCase();
  var currentBranch = $('#transfer_Current_Branch option:selected').text();
  var toBranch = $('#transfer_To_Branch option:selected').text();
  var date = getCurrentDate();
  var dataToPush = {
    username: username,
    currentBranch: currentBranch,
    date: date,
    toBranch: toBranch
  };
  console.log(dataToPush);
  if ((username.length <= 4) || (username == null)) {
    $('#transfer_Error').html('Error: The username is not valid.');
    $('#transfer_Error').css('display', 'block');
    $("#transfer_Request_Modal").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((currentBranch == "Branch") || (toBranch == "Branch") || (currentBranch == null) || (toBranch == null)) {
    $('#transfer_Error').html('Error: The branch selections are invalid.');
    $('#transfer_Error').css('display', 'block');
    $("#transfer_Request_Modal").animate({ scrollTop: 0 }, "slow");
    return;
  }
  getProfileIDURLTransfer(username);
  //Push to database
  userKey = firebaseRef.ref('/PendingTransfer').push().key;
  console.log('User Key: ' + userKey);
  firebaseRef.ref('/PendingTransfer').child(userKey).update(dataToPush);
});
// To Password Reset Page
$('#forgot_Password_Btn').on("click", function() {
  window.location.href = 'passwordReset.html';
});
// Password Reset
$('#password_Reset_Send_Btn').on("click", function() {
  var email = $('#password_Reset_Email').val();
  if ((email.length <= 4) || (email == null)) {
    $('#password_Reset_Error').html('Error: Please enter a valid email.');
    $('#password_Reset_Error').css('display', 'block');
    $("#forgotPasswordForm").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if (email.includes('@')) {
    firebase.auth().sendPasswordResetEmail(email).then(function() {
         // Password Reset Email Sent!
         $('#user_Email_Send_Name').html('Thank You! An email specifying how to reset your password has been sent to <em class="blue-text">' + email + '</em>!');
         $('#resetPasswordNotice').css('display', 'none');
         $('#thankYouNotice').css('display', 'block');
       }).catch(function(error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         // [START_EXCLUDE]
         if (errorCode == 'auth/invalid-email') {
           $('#password_Reset_Error').html('Error: ' + errorMessage);
           $('#password_Reset_Error').css('display', 'block');
           $("#forgotPasswordForm").animate({ scrollTop: 0 }, "slow");
         } else if (errorCode == 'auth/user-not-found') {
           $('#password_Reset_Error').html('Error: ' + errorMessage);
           $('#password_Reset_Error').css('display', 'block');
           $("#forgotPasswordForm").animate({ scrollTop: 0 }, "slow");
         }
         console.log(error);
       });
  } else {
    console.log('The form does not meet the requirements');
    $('#password_Reset_Error').html('Error: Email is invalid.');
    $('#password_Reset_Error').css('display', 'block');
    $("#forgotPasswordForm").animate({ scrollTop: 0 }, "slow");
  }
});

function getCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd < 10) {
    dd ='0'+ dd;
  }
  if(mm < 10) {
    mm ='0'+ mm;
  }

  today = mm +'-'+ dd +'-'+ yyyy;
  return today;
}


function getProfileIDURLTransfer(userIdx) {
  var key = '';
  var searchURL;
  var username = userIdx;
  console.log('Building data for ' + username);
  searchURL = robloxBaseURL + username + endText;
  var uID;
  if (searchURL != (null)) {
    $.ajax({
      url: apiPassThruUrl,
      dataType: 'json',
      method: 'GET',
      data: {"apiEndpoint": searchURL,
      "key": key
    },
    success: function(data) {
      console.log('It was a success!');
      console.log(data);
      uID = data['Id'];
      console.log('After data was obtained the ID is: ' + uID);
      getProfileImageTransfer(uID);
    }});
  } else {
    console.log('THE SEARCH URL IS UNDEFINED');
  }
}


function getProfileImageTransfer(userIDIdx) {
  var user = userIDIdx;
  var firebaseUser = firebase.auth().currentUser;
  console.log('Obtain image from user:  ' + user);
  if (user == (null || NaN)) {
    console.log('ERROR, THE USER ID IS NULL');
  } else {
    profileImageURL = robloxImageURL + user + robloxImageURLEnd;
    console.log('Profile Image URL is: ' + profileImageURL);
    console.log('User key is: ' + userKey);
    //Update the Profile Pic to Firebase
    firebaseRef.ref('/PendingTransfer').child(userKey).update({
      profilePic: profileImageURL
    });
  }
}

$('#transfer_Nav_Btn_Link').on("click", function() {
  //Clear Forms
  console.log('Clearing Transfer Request Forms');
  $('#transfer_Error').val('');
  $('#transfer_Username').val('');
  $("#transfer_Current_Branch").prop('selectedIndex', 0);
  $("#transfer_Current_Branch").material_select();
  $('#transfer_To_Branch').prop('selectedIndex', 0);
  $("#transfer_To_Branch").material_select();
  $('#transfer_Error').css('display', 'none');
  console.log('Opening modal');
  $('#transfer_Error').html('');
  $('#transfer_Error').css('display', 'none');
  $('#transfer_Request_Modal').modal('open');
});

$('#transfer_Nav_Btn_Link_SideNav').on("click", function() {
  //Clear Forms
  console.log('Clearing Transfer Request Forms');
  $('#transfer_Error').val('');
  $('#transfer_Username').val('');
  $("#transfer_Current_Branch").prop('selectedIndex', 0);
  $("#transfer_Current_Branch").material_select();
  $('#transfer_To_Branch').prop('selectedIndex', 0);
  $("#transfer_To_Branch").material_select();
  $('#transfer_Error').css('display', 'none');
  console.log('Opening modal');
  $('#transfer_Error').html('');
  $('#transfer_Error').css('display', 'none');
  //Hide Side Nav
  $('#slide-out').sideNav('hide');
  $('#transfer_Request_Modal').modal('open');
});

function getSimpleRank(strPaygrade, strBranch) {
  console.log(strPaygrade + ' ' + strBranch);
  var branch = strBranch;
  var formattedRank = "";

  if (strPaygrade == 'O-1' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "2LT";
  } else if (strPaygrade == 'O-1' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "ENS";
  } else if (strPaygrade == 'O-2' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "1LT";
  } else if (strPaygrade == 'O-2' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "LTJG";
  } else if (strPaygrade == 'O-3' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "CPT";
  } else if (strPaygrade == 'O-3' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "LT";
  } else if (strPaygrade == 'O-4' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "MAJ";
  } else if (strPaygrade == 'O-4' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "LCDR";
  } else if (strPaygrade == 'O-5' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "LTC";
  } else if (strPaygrade == 'O-5' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "CDR";
  } else if (strPaygrade == 'O-6' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "COL";
  } else if (strPaygrade == 'O-6' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "CAPT";
  } else if (strPaygrade == 'O-7' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "BG";
  } else if (strPaygrade == 'O-7' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "RADM L";
  } else if (strPaygrade == 'O-8' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "MG";
  } else if (strPaygrade == 'O-8' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "RADM U";
  } else if (strPaygrade == 'O-9' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "LTG";
  } else if (strPaygrade == 'O-9' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "VADM";
  } else if (strPaygrade == 'O-10' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "GEN";
  } else if (strPaygrade == 'O-10' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "ADM";
  } else if (strPaygrade == 'SECDEF' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force" || branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "SECDEF";
  } else if (strPaygrade == 'Founder' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force" || branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Mr.";
  }
  console.log('The rank is: ' + formattedRank);
  return formattedRank;
}

// --------------------------------------------------------------------------------------------------
//
function checkData(dataIdx) {
  var data = dataIdx;
  var check;

  if (data == null) {
    check = "true";
    console.log('Data is wrong ' + '(' + data + ')');
  } else if (data != null) {
    check = "false";
    console.log('Data is good ' + '(' + data + ')');
  }
  return check;
}

$('#sign_In_Btn').on('click', function() {
  $('#sign_In_Error').val('');
  $('#sign_In_Error').css('display', 'none');
  //Function Variables
  var email = $('#sign_In_Email').val();
  var password = $('#sign_In_Password').val();
  //Check Password and email
  if ((email.length <= 4) || (email == null)) {
    $('#sign_In_Error').html('Error: Please enter a valid email.');
    $('#sign_In_Error').css('display', 'block');
    $("#sign_In").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((password.length <= 8) || (password == null)) {
    $('#sign_In_Error').html('Error: The password is too short.');
    $('#sign_In_Error').css('display', 'block');
    $("#sign_In").animate({ scrollTop: 0 }, "slow");
    return;
  }

  if ((email.includes('@')) && (password.length > 8)) {
    console.log('sign in account check!');
    $('#sign_In_Error').css('display', 'none');
    //Sign In Account
    firebase.auth().signInWithEmailAndPassword(email, password).then(function() {
      //Account has been created
      console.log('Account has been signed in!');
      $('#sign_In').modal('close');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        console.log('Error: The password does not match.');
        $('#sign_In_Error').html('Error: The password does not match.');
        $('#sign_In_Error').css('display', 'block');
        $("#sign_In").animate({ scrollTop: 0 }, "slow");
      } else if (errorCode == 'auth/user-not-found') {
        console.log('Error: The user does not exist.');
        $('#sign_In_Error').html('Error: No account found with that email address. Please enter a valid email address.');
        $('#sign_In_Error').css('display', 'block');
        $("#sign_In").animate({ scrollTop: 0 }, "slow");
      } else {
        console.log('Error: ' + errorMessage);
        $('#sign_In_Error').html('Error: ' + errorMessage);
        $('#sign_In_Error').css('display', 'block');
        $("#sign_In").animate({ scrollTop: 0 }, "slow");
      }
      console.log(error);
    });
  } else {
    console.log('The form does not meet the requirements');
    $('#sign_In_Error').html('Error: Email and/or password are invalid.');
    $('#sign_In_Error').css('display', 'block');
    $("#sign_In").animate({ scrollTop: 0 }, "slow");
  }
});

$('#sign_Up_Btn').on('click', function() {
  $('#sign_Up_Error').val('');
  $('#sign_Up_Error').css('display', 'none');
  //Function Variables
  email = $('#sign_Up_Email').val();
  var password = $('#sign_Up_Password').val();
  var verifyPassword = $('#sign_Up_Password_Verify').val();
  //Check Password and email
  if ((email.length <= 4) || (email == null)) {
    $('#sign_Up_Error').html('Error: Please enter a valid email.');
    $('#sign_Up_Error').css('display', 'block');
    $("#sign_Up").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((password.length <= 8) || (password == null)) {
    $('#sign_Up_Error').html('Error: The password is too short.');
    $('#sign_Up_Error').css('display', 'block');
    $("#sign_Up").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if (verifyPassword != password) {
    $('#sign_Up_Error').html('The passwords do not match.');
    $('#sign_Up_Error').css('display', 'block');
    $("#sign_Up").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if (email.includes('@') && (password.length > 8) && (verifyPassword == password)) {
    console.log('create account check!');
    $('#sign_Up_Error').css('display', 'none');
    //Create account
    firebase.auth().createUserWithEmailAndPassword(email, verifyPassword).then(function() {
      //Account has been created
      console.log('Account has been created!');
      $('#sign_Up').modal('close');
      console.log('Follow up modal opening...');
      $('#sign_Up_Follow').modal('open');
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      if (errorCode == 'auth/weak-password') {
        console.log('Error: The password is too weak.');
      } else {
        console.log('Error: ' + errorMessage);
        $('#sign_Up_Error').html('Error: ' + errorMessage);
        $('#sign_Up_Error').css('display', 'block');
        $("#sign_Up").animate({ scrollTop: 0 }, "slow");
      }
      console.log(error);
    });
  } else {
    console.log('The form does not meet the requirements');
    $('#sign_Up_Error').html('Error: Email and/or password are invalid.');
    $('#sign_Up_Error').css('display', 'block');
    $("#sign_Up").animate({ scrollTop: 0 }, "slow");
  }
});

$('#sign_Up_Btn_Follow').on('click', function() {
  //Function Variables
  username = $('#sign_Up_Username_Follow').val().toLowerCase();
  getProfileIDURL(username);
  console.log('Getting profile image for ' + username);
  paygrade = $('#sign_Up_Paygrade option:selected').text();
  branch = $('#sign_Up_Branch option:selected').text();
  currentUnit = $('#sign_Up_Current_Unit_Follow').val();
  rank = getRank(paygrade);
  console.log("The image to print is: " + profileID);
  var firebaseUser = firebase.auth().currentUser;
  var date = getCurrentDate();
  console.log('Firebase USer:' + firebaseUser);
  console.log('Write data to Firebase in process...');
  var checkUsername = checkData(username);
  //var checkProfileID = checkData(profileID);
  var checkPaygrade = checkData(paygrade);
  var checkBranch = checkData(branch);
  var checkCurrentUnit = checkData(currentUnit);
  var checkRank = checkData(rank);
  var historyKey;
  var promotionKey;
  var unitHistory = {
    username: username,
    branch: branch,
    unit: currentUnit,
    entranceDate: date,
    departureDate: 'Serving'
  };
  var promotionHistory = {
    username: username,
    promotion: paygrade,
    date: date,
    promotedBy: username
  };
  if ((checkUsername /*&& checkProfileID*/ && checkPaygrade && checkBranch && checkCurrentUnit && checkRank) == "false") {
    //Checks if any of the values is null or undefined, if not, then it will proceed to write the data
    //Write data presented in follow up modal to Firebase
    firebaseRef.ref('/Users').child(username).update({
      admin: 'none',
      branch: branch,
      currentUnit: currentUnit,
      email: email,
      paygrade: paygrade,
      //profilePic: profileID,
      rank: rank
    });
    promotionKey = firebaseRef.ref('/Users/' + username + '/promotions').push().key;
    historyKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
    firebaseRef.ref('/Users/' + username + '/promotions').child(promotionKey).update(promotionHistory);
    firebaseRef.ref('/Users/' + username + '/units').child(historyKey).update(unitHistory);
    firebaseRef.ref('/Users/' + username).update({
      currentUnitKey: historyKey
    });
    //If data is read correctly, then it will be written to Firebase
    console.log('Firebase data written');
    console.log('Current user: ' + firebaseUser);
    var newUsername = capitalizeFirstLetter(username);
    console.log(newUsername);

    //Update the displayName to the users' profile information
    firebaseUser.updateProfile({
      displayName: newUsername
    }).then(function() {
      // Update successful.
      console.log(firebaseUser);
    }, function(error) {
      // An error happened.
    });
    $('#sign_Up_Follow').modal('close');

  } else if ((checkUsername /*|| checkProfileID*/ || checkPaygrade || checkBranch || checkCurrentUnit || checkRank) == "true") {
    alert('There is an error with your data, please verify.');
    $('#sign_Up_Error_Follow').html('Error: Email and/or password are invalid.');
    $('#sign_Up_Error_Follow').css('display', 'block');
    $("#sign_Up_Follow").animate({ scrollTop: 0 }, "slow");
  }
});


function getRank(strPaygrade) {
  console.log(strPaygrade);
  var branch = $('#sign_Up_Branch option:selected').text();
  var formattedRank = "";

  if (strPaygrade == 'O-1' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Second Lieutenant";
  } else if (strPaygrade == 'O-1' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Ensign";
  } else if (strPaygrade == 'O-2' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "First Lieutenant";
  } else if (strPaygrade == 'O-2' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Lieutenant Junior Grade";
  } else if (strPaygrade == 'O-3' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Captain";
  } else if (strPaygrade == 'O-3' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Lieutenant";
  } else if (strPaygrade == 'O-4' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Major";
  } else if (strPaygrade == 'O-4' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Lieutenant Commander";
  } else if (strPaygrade == 'O-5' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Lieutenant Colonel";
  } else if (strPaygrade == 'O-5' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Commander";
  } else if (strPaygrade == 'O-6' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Colonel";
  } else if (strPaygrade == 'O-6' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Captain";
  } else if (strPaygrade == 'O-7' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Brigadier General";
  } else if (strPaygrade == 'O-7' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Rear Admiral LH";
  } else if (strPaygrade == 'O-8' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Major General";
  } else if (strPaygrade == 'O-8' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Rear Admiral UH";
  } else if (strPaygrade == 'O-9' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "Lieutenant General";
  } else if (strPaygrade == 'O-9' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Vice Admiral";
  } else if (strPaygrade == 'O-10' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "General";
  } else if (strPaygrade == 'O-10' && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Admiral";
  }
  console.log('The rank is: ' + formattedRank);
  return formattedRank;
}

//UPDATE THIS, THERE MAY BE A BETTER WAY
function getProfileIDURL(userIdx) {
  var key = '';
  var searchURL;
  var username = userIdx;
  console.log('Building data for ' + username);
  searchURL = robloxBaseURL + username + endText;
  var uID;
  if (searchURL != (null)) {
    $.ajax({
      url: apiPassThruUrl,
      dataType: 'json',
      method: 'GET',
      data: {"apiEndpoint": searchURL,
      "key": key
    },
    success: function(data) {
      console.log('It was a success!');
      console.log(data);
      uID = data['Id'];
      console.log('After data was obtained the ID is: ' + uID);
      getProfileImage(uID);
    }});
  } else {
    console.log('THE SEARCH URL IS UNDEFINED');
  }
}


function getProfileImage(userIDIdx) {
  var user = userIDIdx;
  var firebaseUser = firebase.auth().currentUser;
  console.log('Obtain image from user:  ' + user);
  if (user == (null || NaN)) {
    console.log('ERROR, THE USER ID IS NULL');
  } else {
    profileImageURL = robloxImageURL + user + robloxImageURLEnd;
    console.log('Profile Image URL is: ' + profileImageURL);
    console.log('Username is: ' + username);
    //Update the Profile Pic to Firebase
    firebaseRef.ref('/Users').child(username).update({
      profilePic: profileImageURL
    });
    //Update to Account
    firebaseUser.updateProfile({
      photoURL: profileImageURL
    }).then(function() {
      // Update successful.
      console.log(firebaseUser);
    }, function(error) {
      // An error happened.
    });
  }
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}

$('#sign_Out_Btn').on("click", function() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location = "index.html";
  }, function(error) {
    console.error('Sign Out Error', error);
  });
});

$('#sign_Out_Btn_SideNav').on("click", function() {
  firebase.auth().signOut().then(function() {
    console.log('Signed Out');
    window.location = "index.html";
  }, function(error) {
    console.error('Sign Out Error', error);
  });
});
