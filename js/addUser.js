// TO-DO:
//1. Finish Formatting Enlisted Ranks DONE
//2. Finish "Add User" page DONE
//  - Promotion History --> After calling the add user function, write a function that automatically creates a key and
//    adds it to the user "promotions" section for that rank
//3. Write "Edit User" page DONE
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
//6. Write search page and javascript DONE
//7. User Settings page
//  - Password reset
//  - Verify Email (?)
//  - Merge Account Request?


// Variables
var getData;
var displayUserData;
var currentUser;
var currentAdmin;
var rank;
var branch;
var verified;
var firebaseRef = firebase.database();
var promotionKey;
var historyKey;
var usernameToAdd;

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
    var admin = snapshot.child('admin').val();
    var userAdmin = capitalizeFirstLetter(snapshot.child('admin').val());
    var branch = snapshot.child('branch').val();
    currentUserBranch = snapshot.child('branch').val();
    currentAdmin = snapshot.child('admin').val();
    console.log('USERNAME: ' + username + ', BRANCH: ' + branch + ', ACCOUNT TYPE: ' + userAdmin);

    $('#user_Information_Username').html('Username: <em class="blue-text text-darken-1">' + username + '</em>');
    $('#user_Information_Branch').html('Branch: <em class="blue-text text-darken-1">' + branch + '</em>');
    $('#user_Information_Admin').html('Access Level: <em class="blue-text text-darken-1">' + userAdmin + '</em>');
    if ((admin == "owner") || (admin == "superAdmin") || (admin == "admin") || (admin == "mod") || (admin == "normal")) {
      $('#loader_Container').css('display', 'none');
      $('#main_Container').css('display', 'block');
    } else {
      $('#loader_Container').css('display', 'block');
      $('#main_Container').css('display', 'none');
    }
  });
}

$('#add_User_Btn').on("click", function() {
  var username = $('#add_User_Username').val().toLowerCase();
  //getData = setTimeout(checkIfUserExists(username), 3000);
  checkIfUserExists(username);
});

$('#add_User_Btn_Follow').on("click", function() {
  var username = $('#add_User_Username').val().toLowerCase();
  var currentUnit = $('#add_User_CurrentUnit').val();
  var currentUnitPosition = $('#add_User_CurrentUnit_Pos').val();
  var branch = $('#add_User_Branch option:selected').text();
  var status = $('#add_User_Status option:selected').text();
  var paygrade = $('#add_User_Paygrade option:selected').val();
  var verifiedUser = verified;
  console.log('Verified: ' + verifiedUser);
  console.log(paygrade);
  var date = getCurrentDate();
  rank = getRank(paygrade, branch);
  var unitHistory = {
    username: username,
    branch: branch,
    unit: currentUnit,
    unitPosition: currentUnitPosition,
    entranceDate: date,
    departureDate: 'Serving'
  };
  var promotionHistory = {
    username: username,
    promotion: paygrade,
    date: date,
    promotedBy: currentUser
  };
  if (username.length < 3) {
    $('#add_User_Error').html('Error: Username invalid. Please enter a valid username.');
    $('#add_User_Error').css('display', 'block');
    $("#add_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((branch == null) || (branch == "Select Branch")){
    $('#add_User_Error').html('Error: Branch value invalid. Please select a valid branch.');
    $('#add_User_Error').css('display', 'block');
    $("#add_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((status == null) || (status == "Select User Status")){
    $('#add_User_Error').html('Error: Status value invalid. Please select a valid military status.');
    $('#add_User_Error').css('display', 'block');
    $("#add_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  if ((paygrade == null) || (paygrade.length == 0)) {
    $('#add_User_Error').html('Error: Pay-Grade value invalid. Please select a valid pay-grade.');
    $('#add_User_Error').css('display', 'block');
    $("#add_User_Error").animate({ scrollTop: 0 }, "slow");
    return;
  }
  console.log('User does not exist');
  getProfileIDURL(username);
  promotionKey = firebaseRef.ref('/Users/' + username + '/promotions').push().key;
  historyKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
  firebase.database().ref('Users/' + username).set({
    admin: 'none',
    branch: branch,
    currentUnit: currentUnit,
    currentUnitPosition: currentUnitPosition,
    currentUnitKey: historyKey,
    paygrade: paygrade,
    rank: rank,
    status: status
  });
  console.log('Promotion Key: ' + promotionKey);
  firebaseRef.ref('/Users/' + username + '/promotions').child(promotionKey).update(promotionHistory);
  firebaseRef.ref('/Users/' + username + '/units').child(historyKey).update(unitHistory);
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') added user (' + username + ') on ' + date + '.';
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });

  console.log('Promotion added.');
  $('#add_User_Btn_Container_Follow').css('display', 'none');
  $('#add_User_Username').val('');
  $('#add_User_CurrentUnit').val('');
  $('#add_User_CurrentUnit_Pos').val('');
  $('#add_User_Branch').prop('selectedIndex', 0);
  $('#add_User_Branch').material_select();
  $('#add_User_Paygrade').prop('selectedIndex', 0);
  $('#add_User_Paygrade').material_select();
  $('#add_User_Status').prop('selectedIndex', 0);
  $('#add_User_Status').material_select();
});

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}

function getRank(strPaygrade, strBranch) {
  console.log(strPaygrade);
  var branch = strBranch;
  var formattedRank = "";

  if (strPaygrade == "E-1" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Private";
  } else if (strPaygrade == "E-1" && (branch == "Air Force")) {
    formattedRank = "Airman Basic";
  } else if (strPaygrade == "E-1" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Seaman Recruit";
  } else if (strPaygrade == "E-2" && (branch == "Army")) {
    formattedRank = "Private II";
  } else if (strPaygrade == "E-2" && (branch == "Marine Corps")) {
    formattedRank = "Private First";
  } else if (strPaygrade == "E-2" && (branch == "Air Force")) {
    formattedRank = "Airman";
  } else if (strPaygrade == "E-2" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Seaman Apprentice";
  } else if (strPaygrade == "E-3" && (branch == "Army")) {
    formattedRank = "Private First Class";
  } else if (strPaygrade == "E-3" && (branch == "Marine Corps")) {
    formattedRank = "Lance Corporal";
  } else if (strPaygrade == "E-3" && (branch == "Air Force")) {
    formattedRank = "Airman First Class";
  } else if (strPaygrade == "E-3" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Seaman";
  } else if (strPaygrade == "E-4A" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Corporal";
  } else if (strPaygrade == "E-4B" && (branch == "Army")) {
    formattedRank = "Specialist";
  } else if (strPaygrade == "E-4A" && (branch == "Air Force")) {
    formattedRank = "Senior Airman";
  } else if (strPaygrade == "E-4A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer Third Class";
  } else if (strPaygrade == "E-5" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Sergeant";
  } else if (strPaygrade == "E-5" && (branch == "Air Force")) {
    formattedRank = "Staff Sergeant";
  } else if (strPaygrade == "E-5" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer Second Class";
  } else if (strPaygrade == "E-6" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Staff Sergeant";
  } else if (strPaygrade == "E-6" && (branch == "Air Force")) {
    formattedRank = "Technical Sergeant";
  } else if (strPaygrade == "E-6" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Petty Officer First Class";
  } else if (strPaygrade == "E-7A" && (branch == "Army")) {
    formattedRank = "Sergeant First Class";
  } else if (strPaygrade == "E-7A" && (branch == "Marine Corps")) {
    formattedRank = "Gunnery Sergeant";
  } else if (strPaygrade == "E-7A" && (branch == "Air Force")) {
    formattedRank = "Master Sergeant";
  } else if (strPaygrade == "E-7B" && (branch == "Air Force")) {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-7A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Chief Petty Officer";
  } else if (strPaygrade == "E-8A" && (branch == "Army" || branch == "Marine Corps")) {
    formattedRank = "Master Sergeant";
  } else if (strPaygrade == "E-8A" && (branch == "Air Force")) {
    formattedRank = "Senior Master Sergeant";
  } else if (strPaygrade == "E-8A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Senior Chief Petty Officer";
  } else if (strPaygrade == "E-8B" && (branch == "Army" || branch == "Marine Corps" || branch == "Air Force")) {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-9A" && (branch == "Army")) {
    formattedRank = "Sergeant Major";
  } else if (strPaygrade == "E-9A" && (branch == "Marine Corps")) {
    formattedRank = "Master Gunnary Sergeant";
  } else if (strPaygrade == "E-9A" && (branch == "Air Force")) {
    formattedRank = "Chief Master Sergeant";
  } else if (strPaygrade == "E-9A" && (branch == "Navy" || branch == "Coast Guard")) {
    formattedRank = "Master Chief Petty Officer";
  } else if (strPaygrade == "E-9B" && (branch == "Army")) {
    formattedRank = "Command Sergeant Major";
  } else if (strPaygrade == "E-9B" && (branch == "Marine Corps")) {
    formattedRank = "Sergeant Major";
  } else if (strPaygrade == "E-9B" && (branch == "Air Force")) {
    formattedRank = "First Sergeant";
  } else if (strPaygrade == "E-9B" && (branch == "Navy")) {
    formattedRank = "Force Command Chief Petty Officer";
  } else if (strPaygrade == "E-9B" && (branch == "Coast Guard")) {
    formattedRank = "Command Master Chief";
  } else if (strPaygrade == "SEA" && (branch == "Army")) {
    formattedRank = "Sergeant Major of the Army";
  } else if (strPaygrade == "SEA" && (branch == "Marine Corps")) {
    formattedRank = "Sergeant Major of the Marine Corps";
  } else if (strPaygrade == "E-9C" && (branch == "Air Force")) {
    formattedRank = "Command Chief Master Sergeant";
  } else if (strPaygrade == "E-9C" && (branch == "Navy")) {
    formattedRank = "Fleet Command Chief Petty Officer";
  } else if(strPaygrade == "SEA" && (branch == "Coast Guard")) {
    formattedRank = "Master Chief Petty Officer of the Coast Guard";
  } else if(strPaygrade == "SEA" && (branch == "Air Force")) {
    formattedRank = "Chief Master Sergeant of the Air Force";
  } else if(strPaygrade == "SEA" && (branch == "Navy")) {
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
    userExistsCallback(userIdx, verify);
  });
}

function userExistsCallback(userIdx, verifyIdx) {
  var user = userIdx;
  var checker = verifyIdx;
  if (checker == "true") {
    $('#add_User_Error').html('Error: This user already exists.');
    $('#add_User_Error').css('display', 'block');
    $("#add_User_Container").animate({ scrollTop: 0 }, "slow");
  } else {
    console.log('User does not exist, proceed.');
    $('#add_User_Error').html('');
    $('#add_User_Error').css('display', 'none');
    $('#add_User_Btn_Container_Follow').css('display', 'block');
  }
}

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
      getProfileImage(uID, username);
    }});
  } else {
    console.log('THE SEARCH URL IS UNDEFINED');
  }
}


function getProfileImage(userIDIdx, usernameIdx) {
  var user = userIDIdx;
  var username = usernameIdx;
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
  }
}
