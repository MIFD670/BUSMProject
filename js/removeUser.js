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
var firebaseRef = firebase.database();
var promotionKey;
var usernameToAdd;
var search_Username;
var newUnitKey;
var activityKey;
var unitHistoryKey;
var currentPosition;
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
    if ((admin == "owner") || (admin == "superAdmin") || (admin == "admin")) {
      $('#loader_Container').css('display', 'none');
      $('#main_Container').css('display', 'block');
    } else {
      $('#loader_Container').css('display', 'block');
      $('#main_Container').css('display', 'none');
    }
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
$('#delete_User_Btn').on("click", function() {
  var username = $('#edit_User_Username').val().toLowerCase();
  var date = getCurrentDate();
  var keyToLogs = firebaseRef.ref('Logs').push().key;
  var log = 'Admin user (' + currentUser + ') deleted user (' + username + ') on ' + date + '.';
  firebaseRef.ref('Users/' + username).remove();
  firebaseRef.ref('Logs').child(keyToLogs).update({
    date: date,
    log: log
  });
  console.log('User was removed.');
  location.reload();
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
      currentPosition = snapshot.child('currentUnitPosition').val();
      branch = snapshot.child('branch').val();
      paygrade = snapshot.child('paygrade').val();
      var branchNew = "'" + branch + "'";
      var currentUnitKey = snapshot.child('currentUnitKey').val();
      console.log('1: ' + user + ', 2: ' + currentUnit + ', 3: ' + branch + ', 4: ' + paygrade + ', 5: ' + currentUnitKey);
      $('#edit_User_Username').val(username);
      $('#edit_User_Username_Label').addClass('active');
      $('#edit_User_CurrentUnit').val(currentUnit);
      $('#edit_User_CurrentUnit_Label').addClass('active');
      $('#edit_User_CurrentUnit_Pos').val(currentPosition);
      $('#edit_User_CurrentUnit_Label_Pos').addClass('active');
      $('#edit_User_CurrentUnit_Key').val(currentUnitKey);
      $('#edit_User_CurrentUnit_Key_Label').addClass('active');
      $("#edit_User_Branch option[value=" + branchNew + "]").attr("selected", true);
      $("#edit_User_Paygrade option[value=" + paygrade + "]").attr("selected", true);
      $('#edit_User_Branch').material_select();
      $('#edit_User_Paygrade').material_select();
    });
    // Activity History
    firebaseRef.ref('/Users/' + user + '/activity').orderByChild("date").on("child_added", snap => {
      var username = capitalizeFirstLetter(user);
      var currentActivityKey = snap.key;
      var type = snap.child('type').val();
      var description = snap.child('description').val();
      var sponsor = snap.child('sponsor').val();
      var date = snap.child('date').val();
      // Console logs
      console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT ACTIVITY: ' + type + ', ' + ', DESCRIPTION: ' + description + ', SPONSOR: ' + sponsor);
      // Creates a clone of the vocab card to edit
      var newCard = $('#user_Card_Activity').clone();
      newCard.removeAttr('id');
      newCard.find('.card-title').text(username);
      newCard.find('#activity_Type').html('Activity Type: ' + type);
      newCard.find('#activity_Desc').html('Activity Description: ' + description);
      newCard.find('#activity_Date').html('Activity Date: ' + date);
      newCard.find('#activity_Sponsor').html('Activity Sponsor: ' + sponsor);
      //newCard.find('#user_Img').attr('src', profilePic);
      newCard.removeAttr('style');
      //Appends to "approved section"
      $('#activity_Section').append(newCard);
      $('#activity_Section').css('display', 'block');
      $('#activity_Card_Holder_Error').css('display', 'none');
      // Edit button
      newCard.find('#edit_button').on("click", function() {
        console.log("The edit button works!");
        // replaces current elements with input fields
        newCard.find('.card-title').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Username' type='text'></input><label for='update_Username' class='active white-text'>Username</label></div>");
        newCard.find('#update_Username').val(username);
        newCard.find('#activity_Type').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Type' type='text'></input><label for='update_Type' class='active white-text'>Type</label></div>");
        newCard.find('#update_Type').val(type);
        newCard.find('#activity_Desc').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Desc' type='text'></input><label for='update_Desc' class='active white-text'>Description</label></div>");
        newCard.find('#update_Des').val(description);
        newCard.find('#activity_Date').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Date' type='text'></input><label for='update_Date' class='active white-text'>Date</label></div>");
        newCard.find('#update_Date').val(date);
        newCard.find('#activity_Sponsor').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Sponsor' type='text'></input><label for='update_Sponsor' class='active white-text'>Sponsor</label></div>");
        newCard.find('#update_Sponsor').val(sponsor);
        newCard.find('.card-action').css("display", "block");
        // Does indeed update
        newCard.find('#delete_button').on("click", function() {
          var key = currentUnitKey;
          console.log(key);
          console.log(username);
          // This function updates the key and stores it in the Firebase database
          firebaseRef.ref('/Users/' + username.toLowerCase() + '/activity/' + key).remove();
          console.log('The unit information has been DELETED');
          // Removes the card
          newCard.remove();
          var newDate = getCurrentDate();
          var keyToLogs = firebaseRef.ref('Logs').push().key;
          var log = 'Admin user (' + currentUser + ') deleted user (' + username + ') activity history of (' + type + ') on ' + newDate + '.';
          firebaseRef.ref('Logs').child(keyToLogs).update({
            date: newDate,
            log: log
          });
          Materialize.toast('Activity History Deleted!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
        });
        // Disregards update
        newCard.find('#disregard_button').on("click", function() {
          var newCardInside = $('#card_Inside_Activity').clone();
          console.log("The Disregard Upgrade button works!");
          newCardInside.find('.card-title').text(username);
          newCardInside.find('#activity_Type').html('Activity Type: ' + type);
          newCardInside.find('#activity_Desc').html('Activity Description: ' + description);
          newCardInside.find('#activity_Date').html('Activity Date: ' + date);
          newCardInside.find('#activity_Sponsor').html('Activity Sponsor: ' + sponsor);
          newCard.find('#card_Inside_Activity').remove();
          newCard.append(newCardInside);
          console.log('Disregard!');
        });
      });
    });
    // Award History
    firebaseRef.ref('/Users/' + user + '/awards').on("child_added", snap => {
      var username = capitalizeFirstLetter(user);
      var currentAwardRank = snap.key;
      var awardImage = snap.child('awardImage').val();
      var awardName = snap.child('awardName').val();
      var awardedBy = snap.child('awardedBy').val();
      var citation = snap.child('citation').val();
      var dateAwarded = snap.child('dateAwarded').val();
      // Console logs
      console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT AWARD: ' + awardName + ', ' + ', IMAGE: ' + awardImage + ', CITATION: ' + citation);
      // Creates a clone of the vocab card to edit
      var newCard = $('#user_Card_Awards').clone();
      newCard.removeAttr('id');
      newCard.find('.card-title').text(username);
      newCard.find('#award_Name').html('Award Name: ' + awardName);
      newCard.find('#award_Citation').html('Award Citation: ' + citation);
      newCard.find('#award_By').html('Awarded by: ' + awardedBy);
      newCard.find('#award_Date').html('Awarded on: ' + dateAwarded);
      //newCard.find('#user_Img').attr('src', profilePic);
      newCard.removeAttr('style');
      //Appends to "approved section"
      $('#award_Section').append(newCard);
      $('#award_Section').css('display', 'block');
      $('#award_Card_Holder_Error').css('display', 'none');
      // Edit button
      newCard.find('#edit_button').on("click", function() {
        console.log("The edit button works!");
        // replaces current elements with input fields
        newCard.find('.card-title').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Username' type='text'></input><label for='update_Username' class='active white-text'>Username</label></div>");
        newCard.find('#update_Username').val(username);
        newCard.find('#award_Name').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Name' type='text'></input><label for='update_Name' class='active white-text'>Award Name</label></div>");
        newCard.find('#update_Name').val(awardName);
        newCard.find('#award_Citation').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Citation' type='text'></input><label for='update_Citation' class='active white-text'>Award Citation</label></div>");
        newCard.find('#update_Citation').val(citation);
        newCard.find('#award_By').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Awarder' type='text'></input><label for='update_Awarder' class='active white-text'>Awarded By</label></div>");
        newCard.find('#update_Awarder').val(awardedBy);
        newCard.find('#award_Date').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_AwardDate' type='text'></input><label for='update_AwardDate' class='active white-text'>Awarded On</label></div>");
        newCard.find('#update_AwardDate').val(dateAwarded);
        newCard.find('.card-action').css("display", "block");
        // Does indeed update
        newCard.find('#delete_button').on("click", function() {
          var key = currentAwardRank;
          console.log(key);
          console.log(username);
          // This function updates the key and stores it in the Firebase database
          firebaseRef.ref('/Users/' + username.toLowerCase() + '/awards/' + key).remove();
          console.log('The award information has been DELETED');
          // Removes the card
          newCard.remove();
          var newDate = getCurrentDate();
          var keyToLogs = firebaseRef.ref('Logs').push().key;
          var log = 'Admin user (' + currentUser + ') deleted user (' + username + ') award history of (' + awardName + ') on ' + newDate + '.';
          firebaseRef.ref('Logs').child(keyToLogs).update({
            date: newDate,
            log: log
          });
          Materialize.toast('Award History Deleted!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
        });
        // Disregards update
        newCard.find('#disregard_button').on("click", function() {
          var newCardInside = $('#card_Inside_Award').clone();
          console.log("The Disregard Upgrade button works!");
          newCardInside.find('.card-title').text(username);
          newCardInside.find('#award_Name').html('Award Name: ' + awardName);
          newCardInside.find('#award_Citation').html('Award Citation: ' + citation);
          newCardInside.find('#award_By').html('Awarded by: ' + awardedBy);
          newCardInside.find('#award_Date').html('Awarded on: ' + dateAwarded);
          newCard.find('#card_Inside_Award').remove();
          newCard.append(newCardInside);
          console.log('Disregard!');
        });
      });
    });
    // Promotion History
    firebaseRef.ref('/Users/' + user + '/promotions').orderByChild("date").on("child_added", snap => {
      var username = capitalizeFirstLetter(user);
      var currentPromotionKey = snap.key;
      var promotion = snap.child('promotion').val();
      var promotedBy = snap.child('promotedBy').val();
      var promoteDate = snap.child('date').val();
      // Console logs
      console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT PROMOTION: ' + promotion + ', ' + ', BY: ' + promotedBy + ', DATE: ' + promoteDate);
      // Creates a clone of the vocab card to edit
      var newCard = $('#user_Card_Promotions').clone();
      newCard.removeAttr('id');
      newCard.find('.card-title').text(username);
      newCard.find('#promotion_To').html('Promoted to: ' + promotion);
      newCard.find('#promotion_By').html('Promoted by: ' + promotedBy);
      newCard.find('#promotion_Date').html('Promotion Date: ' + promoteDate);
      //newCard.find('#user_Img').attr('src', profilePic);
      newCard.removeAttr('style');
      //Appends to "approved section"
      $('#promotion_Section').append(newCard);
      $('#promotion_Section').css('display', 'block');
      $('#promotion_Card_Holder_Error').css('display', 'none');
      // Edit button
      newCard.find('#edit_button').on("click", function() {
        console.log("The edit button works!");
        // replaces current elements with input fields
        newCard.find('.card-title').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Username' type='text'></input><label for='update_Username' class='active white-text'>Username</label></div>");
        newCard.find('#update_Username').val(username);
        newCard.find('#promotion_To').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Promotion' type='text'></input><label for='update_Promotion' class='active white-text'>Promoted to</label></div>");
        newCard.find('#update_Promotion').val(promotion);
        newCard.find('#promotion_By').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_PromotedBy' type='text'></input><label for='update_PromotedBy' class='active white-text'>Promoted by</label></div>");
        newCard.find('#update_PromotedBy').val(promotedBy);
        newCard.find('#promotion_Date').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_PromoteDate' type='text'></input><label for='update_PromoteDate' class='active white-text'>Promotion Date</label></div>");
        newCard.find('#update_PromoteDate').val(promoteDate);
        newCard.find('.card-action').css("display", "block");
        // Does indeed update
        newCard.find('#delete_button').on("click", function() {
          var key = currentPromotionKey;
          console.log(key);
          console.log(username);
          // This function updates the key and stores it in the Firebase database
          firebaseRef.ref('/Users/' + username.toLowerCase() + '/promotions/' + key).remove();
          console.log('The unit information has been DELETED');
          // Removes the card
          newCard.remove();
          var newDate = getCurrentDate();
          var keyToLogs = firebaseRef.ref('Logs').push().key;
          var log = 'Admin user (' + currentUser + ') deleted user (' + username + ') promotion history of (' + promotion + ') on ' + newDate + '.';
          firebaseRef.ref('Logs').child(keyToLogs).update({
            date: newDate,
            log: log
          });
          Materialize.toast('Promotion History Deleted!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
        });
        // Disregards update
        newCard.find('#disregard_button').on("click", function() {
          var newCardInside = $('#card_Inside_Promotion').clone();
          console.log("The Disregard Upgrade button works!");
          newCardInside.find('.card-title').text(username);
          newCardInside.find('#promotion_To').html('Promoted to: ' + promotion);
          newCardInside.find('#promotion_By').html('Promoted by: ' + promotedBy);
          newCardInside.find('#promotion_Date').html('Promotion Date: ' + promoteDate);
          newCard.find('#card_Inside_Promotion').remove();
          newCard.append(newCardInside);
          console.log('Disregard!');
        });
      });
    });
    // Unit History
    firebaseRef.ref('/Users/' + user + '/units').orderByChild("departureDate").on("child_added", snap => {
      var username = capitalizeFirstLetter(user);
      var currentUnitKey = snap.key;
      var unit = snap.child('unit').val();
      var unitPosition = snap.child('unitPosition').val();
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
      newCard.find('#user_History_Unit_Position').html('Position: ' + unitPosition);
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
        newCard.find('#user_History_Unit_Position').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Unit_Pos' type='text'></input><label for='update_Unit_Pos' class='active white-text'>Unit Position</label></div>");
        newCard.find('#update_Unit_Pos').val(unitPosition);
        newCard.find('#user_History_Unit_Key').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Key' type='text'></input><label for='update_Key' class='active white-text'>Unit Key</label></div>");
        newCard.find('#update_Key').val(currentUnitKey);
        newCard.find('#user_History_Entrance').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Entrance' type='text'></input><label for='update_Entrance' class='active white-text'>Entrance Date (MM-DD-YYYY)</label></div>");
        newCard.find('#update_Entrance').val(entranceDate);
        newCard.find('#user_History_Departure').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Departure' type='text'></input><label for='update_Departure' class='active white-text'>Departure Date (MM-DD-YYYY)</label></div>");
        newCard.find('#update_Departure').val(departureDate);
        newCard.find('.card-action').css("display", "block");
        // Does indeed update
        newCard.find('#delete_button').on("click", function() {
          var key = currentUnitKey;
          console.log(key);
          console.log(username);
          // This function updates the key and stores it in the Firebase database
          firebaseRef.ref('/Users/' + username.toLowerCase() + '/units/' + key).remove();
          console.log('The unit information has been DELETED');
          // Removes the card
          newCard.remove();
          var newDate = getCurrentDate();
          var keyToLogs = firebaseRef.ref('Logs').push().key;
          var log = 'Admin user (' + currentUser + ') deleted user (' + username + ') unit history of (' + unit + ') on ' + newDate + '.';
          firebaseRef.ref('Logs').child(keyToLogs).update({
            date: newDate,
            log: log
          });
          Materialize.toast('Unit History Deleted!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
        });
        // Disregards update
        newCard.find('#disregard_button').on("click", function() {
          var newCardInside = $('#card_Inside_Unit').clone();
          console.log("The Disregard Upgrade button works!");
          console.log('Disregard: ' + username + branch + unit + entranceDate + departureDate);
          newCardInside.find('.card-title').text(username);
          newCardInside.find('#user_History_Branch').html('Branch: ' + branch);
          newCardInside.find('#user_History_Unit').html('Unit: ' + unit);
          newCardInside.find('#user_History_Unit_Position').html('Position: ' + unitPosition);
          newCardInside.find('#user_History_Entrance').html('Entrance Date: ' + entranceDate);
          newCardInside.find('#user_History_Departure').html('Departure Date: ' + departureDate);
          newCard.find('#card_Inside_Unit').remove();
          newCard.append(newCardInside);
          console.log('Disregard!');
        });
      });
    });
    //
    $('#promotion_Section').css('display', 'block');
    //
    $('#unit_Section').css('display', 'block');
    //
    $('#award_Section').css('display', 'block');
    //
    $('#activity_Section').css('display', 'block');
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
