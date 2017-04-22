// TO-DO:
//1. Finish Formatting Enlisted Ranks DONE
//2. Finish "Add User" page DONE
//  - Promotion History --> After calling the add user function, write a function that automatically creates a key and
//    adds it to the user "promotions" section for that rank
//3. Write "Edit User" page
//  - Update User Data
//  - Add Awards Data
//  - Add Unit History Data
//  - Add Promotion History Data
//4. Write "Delete User" page
//5. Write "Manage Admins" page
//  - Ability to connect accounts (emails added to user database)
//  - Ability to disable accounts
//  - Ability to delete accounts
//  - Ability to change admin types, displayed in sections "normals, mods, admins, super admin, owner"
//6. Write search page and javascript
//7. User Settings page
//  - Password reset
//  - Verify Email (?)
//  - Merge Account Request?


// Variables
var getData;
var displayUserData;
var currentUser;
var currentAdmin;
var currentUnit;
var rank;
var branch;
var paygrade;
var verified;
var toggle = 0;
var toggle1 = 0;
var toggle2 = 0;
var firebaseRef = firebase.database();
var promotionKey;
var usernameToAdd;
var search_Username;
var newUnitKey;
var activityKey;
var unitHistoryKey;

$(document).ready(function() {
  //alert('ManageUsers.js works!');
  //Wait 3 seconds to display data
  displayUserData = setTimeout(displayUserInformation, 2500);
  //getData = setTimeout(showData, 3000);
});

function displayUserInformation () {
  currentUser = firebase.auth().currentUser.displayName.toLowerCase();
  // Get user data to display in "Your Information" section
  firebase.database().ref('/Users/' + currentUser).once('value').then(function(snapshot) {
    var username = capitalizeFirstLetter(currentUser);
    var userAdmin = capitalizeFirstLetter(snapshot.child('admin').val());
    var branch = snapshot.child('branch').val();
    currentUserBranch = snapshot.child('branch').val();
    currentAdmin = snapshot.child('admin').val();
    console.log('USERNAME: ' + username + ', BRANCH: ' + branch + ', ACCOUNT TYPE: ' + userAdmin);

    $('#user_Information_Username').html('Username: <em class="blue-text text-darken-1">' + username + '</em>');
    $('#user_Information_Branch').html('Branch: <em class="blue-text text-darken-1">' + branch + '</em>');
    $('#user_Information_Admin').html('Account Type: <em class="blue-text text-darken-1">' + userAdmin + '</em>');
    $('#main_Container').css('display', 'block');
    $('#circular_Loader_Section').css('display', 'none');
  });
}

$('#search_Username').on('keyup', function(e) {
  if (e.keyCode === 13) {
    search_Username = $('#search_Username').val().toLowerCase();
    console.log('Search user: ' + search_Username);
    $('#sub_Container').css('display', 'none');
    checkIfUserExists(search_Username);
  }
});
// Update Current Data
$('#update_User_Btn').on("click", function() {
  var username = $('#edit_User_Username').val().toLowerCase();
  var newCurrentUnit = $('#edit_User_CurrentUnit').val();
  var newBranch = $('#edit_User_Branch option:selected').text();
  var newPaygrade = $('#edit_User_Paygrade option:selected').val();
  var date = getCurrentDate();
  console.log('Current paygrade is: ' + paygrade);
  console.log('New paygrade is: ' + newPaygrade);
  // If there is a new pay-grade being updated, then send the data to Firebase promotions
  if (newPaygrade !== paygrade) {
    var promotionHistory = {
      username: username,
      promotion: newPaygrade,
      date: date,
      promotedBy: currentUser
    };
  } else {
    console.log('The paygrades equal to eachother.');
  }
  // If there is a new unit being updated, then send the data to Firebase unit history
  if (newCurrentUnit !== currentUnit) {
    var unitHistory = {
      username: username,
      branch: newBranch,
      unit: newCurrentUnit,
      entranceDate: date,
      departureDate: 'UPDATE'
    };
    newUnitKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
    firebaseRef.ref('/Users/' + username + '/units').child(newUnitKey).update(unitHistory);
    firebaseRef.ref('/Users/' + username).update({
      currentUnit: newCurrentUnit,
      currentUnitKey: newUnitKey
    });
  } else {
    console.log('No new units were added.');
  }
  if (username.length < 3) {
    $('#edit_User_Error').html('Error: Username invalid. Please enter a valid username.');
    $('#edit_User_Error').css('display', 'block');
    $("#edit_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((newBranch == null) || (newBranch == "Select Branch")){
    $('#edit_User_Error').html('Error: Branch value invalid. Please select a valid branch.');
    $('#edit_User_Error').css('display', 'block');
    $("#edit_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((newPaygrade == null) || (newPaygrade == "Select Pay-Grade")) {
    $('#edit_User_Error').html('Error: Pay-Grade value invalid. Please select a valid pay-grade.');
    $('#edit_User_Error').css('display', 'block');
    $("#edit_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  rank = getRank(newPaygrade);
  firebase.database().ref('Users/' + username).update({
    branch: newBranch,
    paygrade: newPaygrade,
    rank: rank
  });
  promotionKey = firebaseRef.ref('/Users/' + username + '/promotions').push().key;
  console.log('Promotion Key: ' + promotionKey);
  firebaseRef.ref('/Users/' + username + '/promotions').child(promotionKey).update(promotionHistory);
  console.log('Promotion added.');
  console.log('Units added.');
  $('#add_User_Btn_Container_Follow').css('display', 'none');
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') edited user (' + username + ') on ' + date + '.';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  location.reload();
});
// Add awards to user in Firebase
$('#add_Award_Btn').on("click", function() {
  var username = $('#edit_User_Username').val().toLowerCase();
  console.log('Username for awards:' + username);
  var award = $('#add_User_Award option:selected').val();
  var awardName = $('#add_User_Award option:selected').text();
  var image = $('#add_User_Award option:selected').data('icon');
  console.log('The image is: ' + image);
  var citation = $('#award_Description').val();
  var date = getCurrentDate();
  var awardToAdd = {
    awardName: awardName,
    awardImage: image,
    citation: citation,
    dateAwarded: date,
    awardedBy: currentUser
  };
  if ((award == null) || (award == "Select Branch")){
    $('#award_User_Error').html('Error: Award value invalid. Please select a valid award.');
    $('#award_User_Error').css('display', 'block');
    $("#awards_Section").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if (citation.length == 0) {
    $('#award_User_Error').html('Error: Citation value invalid. Please type a citation before proceeding.');
    $('#award_User_Error').css('display', 'block');
    $("#awards_Section").animate({ scrollTop: 0 }, "slow");
    return;
  }
  firebaseRef.ref('/Users/' + username + '/awards').child(award).update(awardToAdd);
  $('#add_User_Award').prop('selectedIndex', 0);
  $('#add_User_Award').material_select();
  $('#award_Description').val('');
});
// Add activity to user Firebase
$('#add_Activity_Btn').on("click", function() {
  var username = $('#edit_User_Username').val().toLowerCase();
  var activityType = $('#add_User_Activity_Type').val();
  var activityDescription = $('#add_User_Activity_Name').val();
  var completeDate = $('#add_User_Date').val();
  var sponsor = $('#add_User_Sponsor_Name').val();
  console.log('1: ' + username + ', 2: ' + activityType + ', 3: ' + activityDescription + ', 4: ' + completeDate + ', 5: ' + sponsor);
  var activityToAdd = {
    username: username,
    type: activityType,
    description: activityDescription,
    date: completeDate,
    sponsor: sponsor
  };
  if ((activityType.length == 0) || (activityDescription.length == 0) || (!completeDate) || (sponsor.length == 0)) {
    $('#activity_User_Error').html('Error: Input values invalid. Please add values before proceeding.');
    $('#activity_User_Error').css('display', 'block');
    $("#activity_Section").animate({ scrollTop: 0 }, "slow");
    return;
  }
  console.log('Passed, and all values do exist.');
  activityKey = firebaseRef.ref('/Users/' + username + '/activity').push().key;
  firebaseRef.ref('/Users/' + username + '/activity').child(activityKey).update(activityToAdd);
  
  $('#activity_User_Error').css('display', 'none');
  $('#activity_User_Error').text('');
  $('#add_User_Activity_Type').val('');
  $('#add_User_Activity_Name').val('');
  $('#add_User_Sponsor_Name').val('');
  $('#add_User_Date').val('');
});

// Add unit history to user Firebase
$('#add_Unit_History_Btn').on("click", function() {
  var username = $('#edit_User_Username').val().toLowerCase();
  var branch = $('#add_User_Unit_Branch option:selected').text();
  var unitName = $('#add_User_Unit_Name').val();
  var entranceDate = $('#add_User_Unit_Date').val();
  var actualDepartureDate;
  var departureDate = $('#add_User_Unit_Date_Depart').val();
  var currentlyServing;

  if ((branch.length == 0) || (unitName.length == 0) || (!entranceDate)) {
    $('#unit_User_Error').html('Error: Input values invalid. Please add values before proceeding.');
    $('#unit_User_Error').css('display', 'block');
    $("#edit_Unit_Section").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if (($('#serving_Box').is(':checked')) && (departureDate.length == 0)) {
    currentlyServing = "true";
  } else {
    currentlyServing = "false";
  };
  if (currentlyServing == "true") {
    actualDepartureDate = "Serving";
  } else if (currentlyServing == "false") {
    actualDepartureDate = departureDate;
  };
  var unitToAdd = {
    username: username,
    branch: branch,
    unit: unitName,
    entranceDate: entranceDate,
    departureDate: actualDepartureDate
  };
  console.log('Passed, and all values do exist.');
  unitHistoryKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
  firebaseRef.ref('/Users/' + username + '/units').child(unitHistoryKey).update(unitToAdd);

  $('#unit_User_Error').css('display', 'none');
  $('#unit_User_Error').text('');
  $('#add_User_Unit_Name').val('');
  $('#add_User_Unit_Branch').prop('selectedIndex', 0);
  $('#add_User_Unit_Branch').material_select();
  $('#add_User_Unit_Date').val(null);
  $('#add_User_Unit_Date_Depart').val(null);
});

$('#show_Awards_Section_Btn').on("click", function() {
  //0 is false
  if (toggle1 == 0) {
    $('#award_User_Error').html('');
    $('#award_User_Error').css('display', 'none');
    $('#awards_Section').css('display', 'block');
    $('#show_Awards_Section_Btn').html('Close Awards');
    toggle1 = 1;
  } else {
    $('#awards_Section').css('display', 'none');
    $('#show_Awards_Section_Btn').html('Add Awards');
    toggle1 = 0;
  }
});

$('#show_Activity_Section_Btn').on("click", function() {
  //0 is false
  if (toggle2 == 0) {
    $('#activity_Section').css('display', 'block');
    $('#show_Activity_Section_Btn').html('Close Activity');
    toggle2 = 1;
  } else {
    $('#activity_Section').css('display', 'none');
    $('#show_Activity_Section_Btn').html('Add Activity');
    toggle2 = 0;
  }
});

$('#show_Unit_Section_Btn').on("click", function() {
  //0 is false
  if (toggle == 0) {
    $('#edit_Unit_Section').css('display', 'block');
    $('#show_Unit_Section_Btn').html('Close Unit History');
    toggle = 1;
  } else {
    $('#edit_Unit_Section').css('display', 'none');
    $('#show_Unit_Section_Btn').html('Add Unit History');
    toggle = 0;
  }
});

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}

function getRank(strPaygrade) {
  console.log(strPaygrade);
  var branch = $('#edit_User_Branch option:selected').val();
  var formattedRank = "";

  if (strPaygrade == "E-1" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Private";
  } else if (strPaygrade == "E-1" && branch == "Air Force") {
    formattedRank == "Airman Basic";
  } else if (strPaygrade == "E-1" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank == "Seaman Recruit";
  } else if (strPaygrade == "E-2" && branch == "Army") {
    formattedRank = "Private II";
  } else if (strPaygrade == "E-2" && branch == "Marine Corps") {
    formattedRank = "Private First";
  } else if (strPaygrade == "E-2" && branch == "Air Force") {
    formattedRank = "Airman";
  } else if (strPaygrade == "E-2" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Seaman Apprentice";
  } else if (strPaygrade == "E-3" && branch == "Army") {
    formattedRank = "Private First Class";
  } else if (strPaygrade == "E-3" && branch == "Marine Corps") {
    formattedRank = "Lance Corporal";
  } else if (strPaygrade == "E-3" && branch == "Air Force") {
    formattedRank = "Airman First Class";
  } else if (strPaygrade == "E-3" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Seaman";
  } else if (strPaygrade == "E-4A" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Corporal";
  } else if (strPaygrade == "E-4B" && branch == "Army") {
    formattedRank = "Specialist";
  } else if (strPaygrade == "E-4A" && branch == "Air Force") {
    formattedRank = "Senior Airman";
  } else if (strPaygrade == "E-4A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer Third Class";
  } else if (strPaygrade == "E-5" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Sergeant";
  } else if (strPaygrade == "E-5" && branch == "Air Force") {
    formattedRank = "Staff Sergeant";
  } else if (strPaygrade == "E-5" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer Second Class";
  } else if (strPaygrade == "E-6" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Staff Sergeant";
  } else if (strPaygrade == "E-6" && branch == "Air Force") {
    formattedRank = "Technical Sergeant";
  } else if (strPaygrade == "E-6" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer First Class";
  } else if (strPaygrade == "E-7A" && branch == "Army") {
    formattedRank = "Sergeant First Class";
  } else if (strPaygrade == "E-7A" && branch == "Marine Corps") {
    formattedRank = "Gunnery Sergeant";
  } else if (strPaygrade == "E-7A" && branch == "Air Force") {
    formattedRank = "Master Sergeant";
  } else if (strPaygrade == "E-7B" && branch == "Air Force") {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-7A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Chief Petty Officer";
  } else if (strPaygrade == "E-8A" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Master Sergeant";
  } else if (strPaygrade == "E-8A" && branch == "Air Force") {
    formattedRank = "Senior Master Sergeant";
  } else if (strPaygrade == "E-8A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Senior Chief Petty Officer";
  } else if (strPaygrade == "E-8B" && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-9A" && branch == "Army") {
    formattedRank = "Sergeant Major";
  } else if (strPaygrade == "E-9A" && branch == "Marine Corps") {
    formattedRank = "Master Gunnary Sergeant";
  } else if (strPaygrade == "E-9A" && branch == "Air Force") {
    formattedRank = "Chief Master Sergeant";
  } else if (strPaygrade == "E-9A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Master Chief Petty Officer";
  } else if (strPaygrade == "E-9B" && branch == "Army") {
    formattedRank = "Command Sergeant Major";
  } else if (strPaygrade == "E-9B" && branch == "Marine Corps") {
    formattedRank = "Sergeant Major";
  } else if (strPaygrade == "E-9B" && branch == "Air Force") {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-9B" && branch == "Navy") {
    formattedRank = "Force Command Chief Petty Officer";
  } else if(strPaygrade == "E-9B" && branch == "Coast Guard") {
    formattedRank = "Command Master Chief";
  } else if (strPaygrade == "SEA" && branch == "Army") {
    formattedRank = "Sergeant Major of the Army";
  } else if (strPaygrade == "SEA" && branch == "Marine Corps") {
    formattedRank = "Sergeant Major of the Marine Corps";
  } else if (strPaygrade == "E-9C" && branch == "Air Force") {
    formattedRank = "Command Chief Master Sergeant";
  } else if (strPaygrade == "E-9C" && branch == "Navy") {
    formattedRank = "Fleet Command Chief Petty Officer";
  } else if(strPaygrade == "SEA" && branch == "Coast Guard") {
    formattedRank = "Master Chief Petty Officer of the Coast Guard";
  } else if(strPaygrade == "SEA" && branch == "Air Force") {
    formattedRank = "Chief Master Sergeant of the Air Force";
  } else if(strPaygrade == "SEA" && branch == "Navy") {
    formattedRank = "Master Chief Petty Officer of the Navy";
  } else if (strPaygrade == 'O-1' && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
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

function checkIfUserExists(userIdx) {
  //Checks to see if the user already exists
  var user = userIdx;
  var verify;

  firebaseRef.ref('/Users').child(userIdx).once('value', function(snapshot) {
    //If it exists mark it true
    if (snapshot.val() !== null) {
      verify = "true";
      //If it does not, mark it false
    } else {
      verify = "false";
    }
    userExistsCallback(user, verify);
  });
}

function userExistsCallback(userIdx, verifyIdx) {
  var user = userIdx;
  var checker = verifyIdx;
  if (checker == "true") {
    console.log('User does exist!');
    $('#search_User_Error').html('');
    $('#search_User_Error').css('display', 'none');
    //Remove from here and add to the function where it checks if it does exist

    firebaseRef.ref('/Users/' + user).once('value').then(function(snapshot) {
      var username = user;
      currentUnit = snapshot.child('currentUnit').val();
      branch = snapshot.child('branch').val();
      paygrade = snapshot.child('paygrade').val();
      var currentUnitKey = snapshot.child('currentUnitKey').val();
      console.log('1: ' + user + ', 2: ' + currentUnit + ', 3: ' + branch + ', 4: ' + paygrade + ', 5: ' + currentUnitKey);
      $('#edit_User_Username').val(username);
      $('#edit_User_Username_Label').addClass('active');
      $('#edit_User_CurrentUnit').val(currentUnit);
      $('#edit_User_CurrentUnit_Label').addClass('active');
      $('#edit_User_CurrentUnit_Key').val(currentUnitKey);
      $('#edit_User_CurrentUnit_Key_Label').addClass('active');
      $("#edit_User_Branch option[value=" + branch + "]").attr("selected", true);
      $("#edit_User_Paygrade option[value=" + paygrade + "]").attr("selected", true);
      $('#edit_User_Branch').material_select();
      $('#edit_User_Paygrade').material_select();
    });

    firebaseRef.ref('/Users/' + user + '/units').orderByChild("departureDate").on("child_added", snap => {
      var username = capitalizeFirstLetter(user);
      var currentUnitKey = snap.key;
      var unit = snap.child('unit').val();
      var branch = snap.child('branch').val();
      var entranceDate = snap.child('entranceDate').val();
      var departureDate = snap.child('departureDate').val();
      // Console logs
      console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT BRANCH: ' + branch + ', ' + ', ENTRANCE: ' + entranceDate + ', DEPARTURE: ' + departureDate);
      // Creates a clone of the vocab card to edit
      var newCard = $('#user_Card').clone();
      newCard.removeAttr('id');
      newCard.find('.card-title').text(username);
      newCard.find('#user_History_Branch').html('Branch: ' + branch);
      newCard.find('#user_History_Unit').html('Unit: ' + unit);
      newCard.find('#user_History_Unit_Key').html('Unit Key: ' + currentUnitKey);
      newCard.find('#user_History_Entrance').html('Entrance Date: ' + entranceDate);
      newCard.find('#user_History_Departure').html('Departure Date: ' + departureDate);
      //newCard.find('#user_Img').attr('src', profilePic);
      newCard.removeAttr('style');
      //Appends to "approved section"
      $('#unit_Section').append(newCard);
      $('#unit_Section').css('display', 'block');
      $('#unit_Card_Holder_Error').css('display', 'none');
      // Edit button
      newCard.find('#edit_button').on("click", function() {
        console.log("The edit button works!");
        // replaces current elements with input fields
        newCard.find('.card-title').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Username' type='text'></input><label for='update_Username' class='active white-text'>Username</label></div>");
        newCard.find('#update_Username').val(username);
        newCard.find('#user_History_Branch').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Branch' type='text'></input><label for='update_Branch' class='active white-text'>Branch</label></div>");
        newCard.find('#update_Branch').val(branch);
        newCard.find('#user_History_Unit').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Unit' type='text'></input><label for='update_Unit' class='active white-text'>Unit</label></div>");
        newCard.find('#update_Unit').val(unit);
        newCard.find('#user_History_Unit_Key').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Key' type='text'></input><label for='update_Key' class='active white-text'>Unit Key</label></div>");
        newCard.find('#update_Key').val(currentUnitKey);
        newCard.find('#user_History_Entrance').replaceWith("<div class='input-field inline'><input class='white-text' id='update_Entrance' type='text'></input><label for='update_Entrance' class='active white-text'>Entrance Date (MM-DD-YYYY)</label></div>");
        newCard.find('#update_Entrance').val(entranceDate);
        newCard.find('#user_History_Departure').replaceWith("<div class='input-field inline'><input class='white-text' id='update_Departure' type='text'></input><label for='update_Departure' class='active white-text'>Departure Date (MM-DD-YYYY)</label></div>");
        newCard.find('#update_Departure').val(departureDate);
        newCard.find('.card-action').css("display", "block");
        // Does indeed update
        newCard.find('#update_button').on("click", function() {
          var updateBranch = $('#update_Branch').val();
          console.log('Update Branch: ' + updateBranch);
          var updateUnit = $('#update_Unit').val();
          console.log('Update Unit: ' + updateUnit);
          var updateEntrance = $('#update_Entrance').val();
          console.log('Update Entrance: ' + updateEntrance);
          var updateDeparture = $('#update_Departure').val();
          console.log('Update Departure: ' + updateDeparture);
          var key = currentUnitKey;
          console.log(key);
          console.log(username);
          // This function updates the key and stores it in the Firebase database
          firebaseRef.ref('/Users/' + username.toLowerCase() + '/units/' + key).update({
            username: username,
            branch: updateBranch,
            unit: updateUnit,
            entranceDate: updateEntrance,
            departureDate: updateDeparture
          });
          console.log('The unit information has been UPDATED');
          // Returns the card back to normal with updated stuff
          var newCardInside = $('#card_Inside').clone();
          console.log("The Upgrade button works!")
          newCard.find('.card-title').text(username);
          newCardInside.find('#user_History_Branch').html('Branch: ' + updateBranch);
          newCardInside.find('#user_History_Unit').html('Unit: ' + updateUnit);
          newCardInside.find('#user_History_Entrance').html('Entrance Date: ' + updateEntrance);
          newCardInside.find('#user_History_Departure').html('Departure Date: ' + updateDeparture);
          // Hides the "Card-Action" and removes the "editable" view of the cards
          newCard.find('.card-action').css("display", "none");
          newCard.find('#card_Inside').remove();
          // Appends the new, updated "normal" view of the user cards
          newCard.append(newCardInside);
          Materialize.toast('Unit History Updated!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
        });
        // Disregards update
        newCard.find('#disregard_button').on("click", function() {
          var newCardInside = $('#card_Inside').clone();
          console.log("The Disregard Upgrade button works!");
          newCardInside.find('.card-title').text(username);
          newCardInside.find('#user_History_Branch').html('Branch: ' + branch);
          newCardInside.find('#user_History_Unit').html('Unit: ' + unit);
          newCardInside.find('#user_History_Entrance').html('Entrance Date: ' + entranceDate);
          newCardInside.find('#user_History_Departure').html('Departure Date: ' + departureDate);
          newCard.find('#card_Inside').remove();
          newCard.append(newCardInside);
          console.log('Disregard!');
        });
      });
    });
    //
    $('#awards_Section').css('display', 'none');
    //
    $('#activity_Section').css('display', 'none');
    //
    $('#edit_Unit_Section').css('display', 'none');
    //
    $('#sub_Container').css('display', 'block');
    $("#sub_Container").animate({ scrollTop: 100 }, "slow");
  } else {
    console.log('User does not exist, do not proceed.');
    $('#search_User_Error').html('Error: This user does not exist.');
    $('#search_User_Error').css('display', 'block');
    $("#main_Container").animate({ scrollTop: 0 }, "slow");
  }
}
