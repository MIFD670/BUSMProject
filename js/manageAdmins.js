// Variables
var getData;
var displayUserData;
var currentUser;
var currentAdmin;
var currentUserBranch;
var firebaseRef = firebase.database();
var toggle1 = 0;
var newCode;
var userToUpdateAdmin;

$(document).ready(function() {
  //alert('ManageUsers.js works!');
  //Wait 3 seconds to display data
  displayUserData = setTimeout(displayUserInformation, 2500);
  getData = setTimeout(showData, 3000);
});

function displayUserInformation() {
  currentUser = firebase.auth().currentUser.displayName.toLowerCase();
  // Get user data to display in "Your Information" section
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot) {
    var username = capitalizeFirstLetter(currentUser);
    var userAdmin = capitalizeFirstLetter(snapshot.child('admin').val());
    var branch = snapshot.child('branch').val();
    currentUserBranch = snapshot.child('branch').val();
    currentAdmin = snapshot.child('admin').val();
    //console.log('USERNAME: ' + username + ', BRANCH: ' + branch + ', ACCOUNT TYPE: ' + userAdmin);
    if (currentAdmin == "admin") {
      $('#admin_Container').css('display', 'block');
    } else if (currentAdmin == "superAdmin") {
      $('#super_Admin_Container').css('display', 'block');
    } else if (currentAdmin == "owner") {
      $('#owner_Container').css('display', 'block');
    }
    $('#user_Information_Username').html('Username: <em class="blue-text text-darken-1">' + username + '</em>');
    $('#user_Information_Branch').html('Branch: <em class="blue-text text-darken-1">' + branch + '</em>');
    $('#user_Information_Admin').html('Access Level: <em class="blue-text text-darken-1">' + userAdmin + '</em>');
  });
}

$("#delete_Announcement_Btn i").hover(function(){
  $(this).removeClass('white-text');
  $(this).addClass('red-text');
}, function(){
  $(this).removeClass('red-text');
  $(this).addClass('white-text');
});

function showData() {
  //console.log('The current user is: ' + currentUser);

  //Loops through important announcements found in Firebase
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
    //console.log('CHECK USER IS: ' + username + ', ' +  ', DATE: ' + date);
    // Creates a clone of the list to edit
    var newList = $('#announcement_Information').clone();
    newList.removeAttr('id');
    newList.find('#announcement_User').text(username);
    newList.find('#announcement_Type').text(type);
    newList.find('#announcement_Message').text(message);
    newList.find('#announcement_Date').text(date);
    newList.removeAttr('style');
    newList.css('display', '');
    $('#announcement_Head').css('display', '');
    $('#announcement_Holder').prepend(newList);
    // Delete Button
    newList.find('td #delete_Announcement_Btn').on("click", function() {
      var key = snap.key;
      var logDate = getCurrentDate();
      //console.log('Key At this point is: ' + key);
      firebaseRef.ref('/Announcements').child(key).remove();
      newList.remove();
      var keyToLogs = firebaseRef.ref('Logs').push().key;
      var log = 'Admin user (' + currentUser + ') deleted announcement (' + message + ') on ' + logDate + ' .';
      firebaseRef.ref('Logs').child(keyToLogs).update({
        date: date,
        log: log
      });
      console.log("REMOVE: Successfully removed announcement");
      Materialize.toast('Success!', 4000);
    });
  });
  // Admin list
  firebaseRef.ref('/Users').orderByChild("email").startAt(!null).on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.key);
    var rank = snap.child('rank').val();
    var admin = capitalizeFirstLetter(snap.child('admin').val());
    var checkAdmin = snap.child('admin').val();
    var branch = snap.child('branch').val();
    var email = snap.child('email').val();
    var date = getCurrentDate();
    // Console logs
    //console.log('Username: ' + username + ', rank: ' + rank + ', admin: ' + admin + ', branch: ' + branch + ', email: ' + email);
    // Creates a clone of the vocab card to edit
    var newList = $('#admin_Information').clone();
    newList.removeAttr('id');
    newList.find('#admin_Username').text(username);
    newList.find('#admin_Rank').text(rank);
    newList.find('#admin_Branch').text(branch);
    newList.find('#admin_Email').text(email);
    newList.find('#admin_Access').text(admin);
    //newList.find('#admin_Access_Input').val(admin);
    newList.removeAttr('style');
    //
    $('#activityHead').css('display', '');
    // Appending
    $('#admin_Holder').append(newList);
    // Action buttons
    /*
    newList.find('#update_Admin_Input').on('change', function() {
    var newAdminAccess = newList.find('#update_Admin_Select').val();
    if (newAdminAccess != admin) {
    console.log('Admins have changed.');
    var updateAccess = {
    admin: newAdminAccess
  };
  firebaseRef.ref('/Users/' + username.toLowerCase()).update(updateAccess);
  // Log
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') edited user (' + username.toLowerCase() + ') admin on ' + date + ' from ' + admin + ' to' + newAdminAccess + '.';
  firebaseRef.ref('Logs').child(keyToLogs).update({
  date: date,
  log: log
});
newList.find('#admin_Access').text(capitalizeFirstLetter(newAdminAccess));
} else if (newAdminAccess == admin) {
console.log('Admins remain the same.');
}
});
*/
});
// Activity Logs
firebaseRef.ref('/Logs').orderByChild("date").limitToLast(25).on("child_added", snap => {
  var description = snap.child('log').val();
  var date = snap.child('date').val();
  // Console logs
  //console.log('Log: ' + description + ', date: ' + date);
  // Creates a clone of the vocab card to edit
  var newList = $('#log_Information').clone();
  newList.removeAttr('id');
  newList.find('#log_Description').text(description);
  newList.find('#log_Date').text(date);
  newList.removeAttr('style');
  newList.css('display', '');
  //
  $('#logHead').css('display', '');
  // Appending
  $('#log_Holder').prepend(newList);
});
// Server Settings
firebaseRef.ref('/ServerSettings/').once('value').then(function(snapshot) {
  var currentCode = snapshot.child('verifyCode').val();
  $('#current_Code_Text').text('Current Verification Code: ' + currentCode);
});

currentUser = firebase.auth().currentUser.displayName.toLowerCase();

firebase.database().ref('/Users/' + currentUser.toLowerCase()).once('value').then(function(snapshot) {
  var userAdmin = snapshot.child('admin').val();
  if ((userAdmin == "owner") || (userAdmin == "superAdmin") || (userAdmin == "admin")) {
    $('#loader_Container').css('display', 'none');
    $('#main_Container').css('display', 'block');
  } else {
    $('#loader_Container').css('display', 'block');
    $('#main_Container').css('display', 'none');
  }
});

}

// Important Announcement
$('#important_Announcement_Btn').on('click', function() {
  var username = currentUser;
  var messageToPush = $('#important_Announcement_Input').val();
  var date = getCurrentDate();
  var color = '#e53935';
  //console.log('Current username: ' + username);
  if (messageToPush.length < 5) {
    $('#announcement_Error').html('Error: The message is too short and/or invalid.');
    $('#announcement_Error').css('display', 'block');
    $("#server_Announcements").animate({ scrollTop: 0 }, "slow");
    return;
  }
  var announcementKey = firebaseRef.ref('Announcements').push().key;
  firebaseRef.ref('Announcements/').child(announcementKey).update({
    username: username,
    date: date,
    message: messageToPush,
    color: color
  });
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') added important announcement (' + messageToPush + ') on ' + date + ' .';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  $('#announcement_Error').html('');
  $('#announcement_Error').css('display', 'none');
  $('#important_Announcement_Input').html('');
});

// Normal Announcements
$('#normal_Announcement_Btn').on('click', function() {
  var username = currentUser;
  var messageToPush = $('#normal_Announcement_Input').val();
  var date = getCurrentDate();
  var color = '#fb8c00';
  //console.log('Current username: ' + username);
  if (messageToPush.length < 5) {
    $('#announcement_Error').html('Error: The message is too short and/or invalid.');
    $('#announcement_Error').css('display', 'block');
    $("#server_Announcements").animate({ scrollTop: 0 }, "slow");
    return;
  }
  var announcementKey = firebaseRef.ref('Announcements').push().key;
  firebaseRef.ref('Announcements/').child(announcementKey).update({
    username: username,
    date: date,
    message: messageToPush,
    color: color
  });
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') added normal announcement (' + messageToPush + ') on ' + date + ' .';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  $('#announcement_Error').html('');
  $('#announcement_Error').css('display', 'none');
  $('#normal_Announcement_Input').html('');
});

// Get New Code
$('#generate_New_Code').on("click", function() {
  newCode = getRandomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  $('#new_Code_Text').text('New Code: ' + newCode);
  $('#new_Code_Text').css('display', 'block');
  $('#update_New_Code').css('display', '');
});

$('#update_New_Code').on("click", function() {
  var codeToPush = newCode;
  var date = getCurrentDate();
  var updateCode = {
    verifyCode: codeToPush
  }
  firebaseRef.ref('ServerSettings').update(updateCode);
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') updated verification string to (' + codeToPush + ') on ' + date + ' .';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  location.reload();

});

function getRandomString(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  //console.log(newWord);
  return newWord;
}

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

$('#admin_Search_Username').on('keyup', function(e) {
  if (e.keyCode === 13) {
    var search_Username = $('#admin_Search_Username').val().toLowerCase();
    console.log('Selected username: ' + search_Username);
    if (search_Username.length > 3) {
      checkIfUserExists(search_Username);
    } else {
      $('#admin_User_Error').html('Error: Username is too short.');
      $('#admin_User_Error').css('display', 'block');
      $("#server_Settings").animate({ scrollTop: 0 }, "slow");
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
    $('#admin_User_Error').html('Error: Username does not exist.');
    $('#admin_User_Error').css('display', 'block');
    $("#server_Settings").animate({ scrollTop: 0 }, "slow");
  } else if (checker == "true") {
    console.log('User exists, proceed.');
    firebaseRef.ref('/Users/' + user).once('value', function(snapshot) {
      userToUpdateAdmin = user;
      console.log('User exists name: ' + userToUpdateAdmin);
      var admin = capitalizeFirstLetter(snapshot.child('admin').val());
      $('#admin_Acess_Label').html('Current Administrative Access: <em class="blue-text">' + admin + '</em>');
    });
  }
}

$('#update_Administrative_Access_Btn').on("click", function() {
  var user = userToUpdateAdmin;
  var admin_Select = $('#admin_Select option:selected').val();
  var super_Admin_Select = $('#super_Admin_Select option:selected').val();
  var owner_Select = $('#owner_Select option:selected').val();
  var final_Select_Value;
  console.log('1: ' + admin_Select + ', 2: ' + super_Admin_Select + ', 3: ' + owner_Select + '.');
  // Check if any of the selects are selected
  if ((admin_Select == null) && (super_Admin_Select == null) && (owner_Select == null)) {
    $('#admin_User_Error').html('Error: No admin value selected.');
    $('#admin_User_Error').css('display', 'block');
    $("#server_Settings").animate({ scrollTop: 0 }, "slow");
    return;
  } else if ((admin_Select != null) && (super_Admin_Select == null) && (owner_Select == null)) {
    final_Select_Value = admin_Select;
    console.log('This is the final value: ' + final_Select_Value);
    firebaseRef.ref('Users/' + user).update({
      admin: final_Select_Value
    });
  } else if ((admin_Select == null) && (super_Admin_Select != null) && (owner_Select == null)) {
    final_Select_Value = super_Admin_Select;
    console.log('This is the final value: ' + final_Select_Value);
    firebaseRef.ref('Users/' + user).update({
      admin: final_Select_Value
    });
  } else if ((admin_Select == null) && (super_Admin_Select == null) && (owner_Select != null)) {
    final_Select_Value = owner_Select;
    console.log('This is the final value: ' + final_Select_Value);
    firebaseRef.ref('Users/' + user).update({
      admin: final_Select_Value
    });
  }
  // Logs
  var logDate = getCurrentDate();
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') changed user (' + user + ') admin to (' + final_Select_Value + ') on ' + logDate + '.';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  location.reload();
});
