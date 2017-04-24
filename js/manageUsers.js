// Variables
var getData;
var displayUserData;
var currentUser;
var currentAdmin;
var currentUserBranch;
var firebaseRef = firebase.database();
var search_Query = '?username=';
var currentURL = $(location).attr('href');

$(document).ready(function() {
  //alert('ManageUsers.js works!');
  //Wait 3 seconds to display data
  displayUserData = setTimeout(displayUserInformation, 2500);
  getData = setTimeout(showData, 3000);
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
  });
}

function showData() {
  currentUser = firebase.auth().currentUser.displayName.toLowerCase();
  console.log('The current user is: ' + currentUser);

  //Loops through users found in Firebase
  firebaseRef.ref('/Users').on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.key);
    var paygrade = snap.child('paygrade').val();
    var branch = snap.child('branch').val();
    var profileImage = snap.child('profilePic').val();
    // Console logs
    console.log('CHECK USER IS: ' + username + ', ' + 'PAYGRADE: ' + paygrade + ', ' + ' BRANCH: ' + branch);
    // Creates a clone of the vocab card to edit
    var newCard = $('#user_Card').clone();
    newCard.removeAttr('id');
    newCard.find('#user_Username').html(username);
    newCard.find('#user_Paygrade').html('Pay-Grade: ' + paygrade);
    newCard.find('#user_Img').attr('src', profileImage);
    newCard.removeAttr('style');
    //Checks the branch and location to where append the cards
    if (branch == "Army") {
      $('#army_Card_Holder').append(newCard);
      $('#army_Card_Holder_Error').css('display', 'none');
    }else if (branch == "Air Force") {
      $('#af_Card_Holder').append(newCard);
      $('#af_Card_Holder_Error').css('display', 'none');
    }else if (branch == "Marine Corps") {
      $('#mc_Card_Holder').append(newCard);
      $('#mc_Card_Holder_Error').css('display', 'none');
    }else if (branch == "Coast Guard") {
      $('#cg_Card_Holder').append(newCard);
      $('#cg_Card_Holder_Error').css('display', 'none');
    }else if (branch == "Navy") {
      $('#navy_Card_Holder').append(newCard);
      $('#navy_Card_Holder_Error').css('display', 'none');
    }

    console.log('The current user branch is: ' + currentUserBranch + ' and, ' + currentAdmin);
    displayBranchData(currentUserBranch, currentAdmin);

    newCard.on("click", function() {
      console.log(username + ' card has been clicked.');
      window.location ='userProfile.html' + search_Query + username;
    });

    // newCard.removeAttr('style');
    // // Verifies the section of the cards and then changes the border colors based on so
    // if (section == "General"){
    //   newCard.css('border-color', '#2196f3');
    // } else if (section == "Unit 1") {
    //   newCard.css('border-color', '#4caf50');
    // } else if (section == "Unit 2") {
    //   newCard.css('border-color', '#ee6e73');
    // }
    // // Appends the vocab card to the "card_holder" div
    // $('#card_holder').append(newCard);
    // $('#loader_section').css('display', 'none');
    // $('#card_holder').css('display', 'block');
    // // Edit button
    // newCard.find('#edit_button').on("click", function() {
    //   console.log("The edit button works!");
    //   // replaces current elements with input fields
    //   newCard.find('.card-title').replaceWith("<div class='input-field inline'><input disabled id='update_Worde' type='text'></input><label for='update_Worde' class='active'>Vocabulary Word</label></div>");
    //   newCard.find('#update_Worde').val(word);
    //   newCard.find('#speech').replaceWith("<div class='input-field inline'><input id='update_Speeche' type='text'></input><label for='update_Speeche' class='active'>Word Speech</label></div>");
    //   newCard.find('#update_Speeche').val(speech);
    //   newCard.find('#section').replaceWith("<div class='input-field inline'><input id='update_Sectione' type='text'></input><label for='update_Sectione' class='active'>Section</label></div>");
    //   newCard.find('#update_Sectione').val(section);
    //   newCard.find('#definition').replaceWith("<div class='input-field'><textarea id='update_Definitione' class='materialize-textarea'></textarea><label for='update_Definitione' class='active'>Definition</label></div>");
    //   newCard.find('#update_Definitione').val(definition);
    //   newCard.find('.card-action').css("display", "block");
    //   // Does indeed update
    //   newCard.find('#update_button').on("click", function() {
    //     var newWord = $('#update_Worde').val();
    //     var newSection = $('#update_Sectione').val();
    //     var newSpeech = $('#update_Speeche').val();
    //     var newDef = $('#update_Definitione').val();
    //     // This function updates the key and stores it in the Firebase database
    //     firebaseRef.ref('/Vocabulary/' + word).set({
    //       word: word,
    //       section: newSection,
    //       speech: newSpeech,
    //       definition: newDef
    //     });
    //     // Console logs
    //     console.log('1: ' + newWord + ' 2: ' + newSection + ' 3: ' + newSpeech + ' 4: ' + newDef);
    //     // Returns the card back to normal with updated stuff
    //     var newCardInside = $('#card_Inside').clone();
    //     console.log("The Upgrade button works!")
    //     newCardInside.find('.card-title').text(newWord);
    //     newCardInside.find('#speech').html(newSpeech);
    //     newCardInside.find('#definition').html(newDef);
    //     // Checks to see what section the word is in and then changes the border color
    //     if (newSection == "General"){
    //       newCard.css('border-color', '#2196f3');
    //     } else if (newSection == "Unit 1") {
    //       newCard.css('border-color', '#4caf50');
    //     } else if (newSection == "Unit 2") {
    //       newCard.css('border-color', '#ee6e73');
    //     }
    //     // Hides the "Card-Action" and removes the "editable" view of the cards
    //     newCard.find('.card-action').css("display", "none");
    //     newCard.find('#card_Inside').remove();
    //     // Appends the new, updated "normal" view of the vocab cards
    //     newCard.append(newCardInside);
    //     Materialize.toast('Vocabulary Word Updated!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
    //   });
    //   // Disregards update
    //   newCard.find('#disregard_button').on("click", function() {
    //     var newCardInside = $('#card_Inside').clone();
    //     console.log("The Disregard Upgrade button works!")
    //     newCardInside.find('.card-title').text(word);
    //     newCardInside.find('#speech').html(speech);
    //     newCardInside.find('#definition').html(definition);
    //     newCard.find('.card-action').css("display", "none");
    //     newCard.find('#card_Inside').remove();
    //     newCard.append(newCardInside);
    //   });
    //   newCard.find('#delete_button').on("click", function() {
    //     firebaseRef.ref('/Vocabulary/' + word).remove();
    //     newCard.remove();
    //     console.log("REMOVE: Successfully removed card and vocabulary word from Firebase!");
    //     Materialize.toast('Vocabulary Word Removed!', 4000);
    //   });
    // });
  });
}

function displayBranchData(branchIdx, adminIdx) {
  var currentBranch = branchIdx;
  var currentAdminType = adminIdx;
  console.log('Received data branch: ' + currentBranch + ', admin: ' + currentAdminType);
  if ((currentBranch == "Army") && ((currentAdminType == "normal") || (currentAdminType == "mod"))) {
    $('#army_Section').css('display', 'block');
  } else if ((currentBranch == "Air Force") && ((currentAdminType == "normal") || (currentAdminType == "mod"))) {
    $('#af_Section').css('display', 'block');
  } else if ((currentBranch == "Marine Corps") && ((currentAdminType == "normal") || (currentAdminType == "mod"))) {
    $('#mc_Section').css('display', 'block');
  } else if ((currentBranch == "Coast Guard") && ((currentAdminType == "normal") || (currentAdminType == "mod"))) {
    $('#cg_Section').css('display', 'block');
  } else if ((currentBranch == "Navy") && ((currentAdminType == "normal") || (currentAdminType == "mod"))) {
    $('#navy_Section').css('display', 'block');
  } else if ((currentAdminType == "admin") || (currentAdminType == "owner")) {
    $('#army_Section').css('display', 'block');
    $('#af_Section').css('display', 'block');
    $('#mc_Section').css('display', 'block');
    $('#cg_Section').css('display', 'block');
    $('#navy_Section').css('display', 'block');
  }

  var measureAF = $('#af_Card_Holder').children().size() - 2;
  var measureArmy = $('#army_Card_Holder').children().size() - 1;
  var measureCG = $('#cg_Card_Holder').children().size() - 1;
  var measureMC = $('#mc_Card_Holder').children().size() - 1;
  var measureNavy = $('#navy_Card_Holder').children().size() - 1;
  $('#airForce_Text').html('Air Force Personnel (' + measureAF + ')');
  $('#army_Text').html('Army Personnel (' + measureArmy + ')');
  $('#coastGuard_Text').html('Coast Guard Personnel (' + measureCG + ')');
  $('#marineCorps_Text').html('Marine Corps Personnel (' + measureMC + ')');
  $('#navy_Text').html('Navy Personnel (' + measureNavy + ')');

  $('#loader_Container').css('display', 'none');
  $('#main_Container').css('display', 'block');
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}
