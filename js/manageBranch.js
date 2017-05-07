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

function displayUserInformation() {
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
    $('#user_Information_Admin').html('Access Level: <em class="blue-text text-darken-1">' + userAdmin + '</em>');
  });
}

function showData() {
  currentUser = firebase.auth().currentUser.displayName.toLowerCase();
  console.log('The current user is: ' + currentUser);

  //Loops through transfer found in Firebase
  firebaseRef.ref('/PendingTransfer').on("child_added", snap => {
    var key = snap.key;
    var username = capitalizeFirstLetter(snap.child('username').val());
    var currentBranch = snap.child('currentBranch').val();
    var toBranch = snap.child('toBranch').val();
    var date = snap.child('date').val();
    var profilePic = snap.child('profilePic').val();
    // Console logs
    console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT BRANCH: ' + currentBranch + ', ' + ' TO BRANCH: ' + toBranch + ', DATE: ' + date);
    // Creates a clone of the vocab card to edit
    var newCard = $('#user_Card').clone();
    newCard.removeAttr('id');
    newCard.find('#user_Username').html(username);
    newCard.find('#user_Request').html('Requested to transfer from <em class="blue-text text-darken-1">' + currentBranch + '</em> to <em class="blue-text text-darken-1">' + toBranch + '</em> on ' + date);
    newCard.find('#user_Img').attr('src', profilePic);
    newCard.removeAttr('style');
    //Checks the branch and location to where append the cards
    if (currentBranch == "Army") {
      $('#army_Card_Holder_Transfer').append(newCard);
      $('#army_Card_Holder_Error').css('display', 'none');
    }else if (currentBranch == "Air Force") {
      $('#af_Card_Holder_Transfer').append(newCard);
      $('#af_Card_Holder_Error').css('display', 'none');
    }else if (currentBranch == "Marine Corps") {
      $('#mc_Card_Holder_Transfer').append(newCard);
      $('#mc_Card_Holder_Error').css('display', 'none');
    }else if (currentBranch == "Coast Guard") {
      $('#cg_Card_Holder_Transfer').append(newCard);
      $('#cg_Card_Holder_Error').css('display', 'none');
    }else if (currentBranch == "Navy") {
      $('#navy_Card_Holder_Transfer').append(newCard);
      $('#navy_Card_Holder_Error').css('display', 'none');
    }

    console.log('The current user branch is: ' + currentUserBranch + ' and, ' + currentAdmin);
    displayBranchData(currentUserBranch, currentAdmin);

    newCard.find('#user_Request_Accept').on("click", function() {
      //Local Variables
      var date = getCurrentDate();
      var oldRef = '/PendingTransfer/';
      var newRef = '/AcceptTransfer/';
      var user = key;
      var status = "accept";
      console.log('Current key: ' + user);
      console.log('The request was accepted by ' + currentUser);
      //Sends data to be moved in Firebase
      moveFirebaseData(oldRef, newRef, user, date, status);
      var keyToLogs = firebaseRef.ref('Logs').push().key;
      var log = 'Admin user (' + currentUser + ') accepted user (' + username + ') transfer request on ' + date + '.';
      firebaseRef.ref('Logs').child(keyToLogs).update({
        date: date,
        log: log
      });
      newCard.remove();
      console.log("REMOVE: Successfully removed card and changed the transfer request!");
      Materialize.toast('Success: Transfer Approved!', 4000);
    });

    newCard.find('#user_Request_Deny').on("click", function() {
      //Local Variables
      var date = getCurrentDate();
      var oldRef = '/PendingTransfer/';
      var newRef = '/DenyTransfer/';
      var user = key;
      var status = "deny";
      console.log('The request was accepted by ' + currentUser);
      //Sends data to be moved in Firebase
      moveFirebaseData(oldRef, newRef, user, date, status);
      var keyToLogs = firebaseRef.ref('Logs').push().key;
      var log = 'Admin user (' + currentUser + ') denied user (' + username + ') transfer request on ' + date + '.';
      firebaseRef.ref('Logs').child(keyToLogs).update({
        date: date,
        log: log
      });
      newCard.remove();
      console.log("REMOVE: Successfully removed card and changed the transfer request!");
      Materialize.toast('Success: Transfer Denied!', 4000);
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
    $('#loader_Container').css('display', 'none');
    $('#main_Container').css('display', 'block');
  });
  //Loops through the approved transfer requests
  firebaseRef.ref('/AcceptTransfer').orderByChild("acceptedOn").limitToLast(10).on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.child('username').val());
    var currentBranch = snap.child('currentBranch').val();
    var toBranch = snap.child('toBranch').val();
    var date = snap.child('date').val();
    var profilePic = snap.child('profilePic').val();
    var acceptedBy = snap.child('acceptedBy').val();
    var acceptedOn = snap.child('acceptedOn').val();
    // Console logs
    console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT BRANCH: ' + currentBranch + ', ' + ' TO BRANCH: ' + toBranch + ', DATE: ' + date + ', ON: ' + acceptedOn + ', BY: ' + acceptedBy);
    // Creates a clone of the vocab card to edit
    var newCard = $('#user_Card').clone();
    newCard.removeAttr('id');
    newCard.find('#user_Username').html(username);
    newCard.find('#user_Request').html('Request to transfer from <em class="blue-text text-darken-1">' + currentBranch + '</em> to <em class="blue-text text-darken-1">' + toBranch + '</em> on ' + date + ' was accepted by <em class="blue-text text-darken-1">' + acceptedBy + '</em> on ' + acceptedOn + '.');
    newCard.find('#user_Img').attr('src', profilePic);
    newCard.find('.card-action').remove();
    newCard.removeAttr('style');
    //Appends to "approved section"
    $('#accepted_Card_Holder_Transfer').prepend(newCard);
    $('#accepted_Card_Holder_Error').css('display', 'none');
    $('#accepted_Section').css('display', 'block');
  });
  //Loops through the denied transfer requests
  firebaseRef.ref('/DenyTransfer').orderByChild("deniedOn").limitToFirst(10).on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.child('username').val());
    var currentBranch = snap.child('currentBranch').val();
    var toBranch = snap.child('toBranch').val();
    var date = snap.child('date').val();
    var profilePic = snap.child('profilePic').val();
    var deniedBy = snap.child('deniedBy').val();
    var deniedOn = snap.child('deniedOn').val();
    // Console logs
    console.log('CHECK USER IS: ' + username + ', ' + 'CURRENT BRANCH: ' + currentBranch + ', ' + ' TO BRANCH: ' + toBranch + ', DATE: ' + date + ', ON: ' + deniedOn + ', BY: ' + deniedBy);
    // Creates a clone of the vocab card to edit
    var newCard = $('#user_Card').clone();
    newCard.removeAttr('id');
    newCard.find('#user_Username').html(username);
    newCard.find('#user_Request').html('Request to transfer from <em class="blue-text text-darken-1">' + currentBranch + '</em> to <em class="blue-text text-darken-1">' + toBranch + '</em> on ' + date + ' was denied by <em class="blue-text text-darken-1">' + deniedBy + '</em> on ' + deniedOn + '.');
    newCard.find('#user_Img').attr('src', profilePic);
    newCard.find('.card-action').remove();
    newCard.removeAttr('style');
    //Appends to "approved section"
    $('#denied_Card_Holder_Transfer').prepend(newCard);
    $('#denied_Card_Holder_Error').css('display', 'none');
    $('#denied_Section').css('display', 'block');
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
  $('#accepted_Section').css('display', 'block');
  $('#denied_Section').css('display', 'block');
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
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

function moveFirebaseData(oldRefIdx, newRefIdx, keyIdx, dateIdx, statusIdx) {
  var oldRef = oldRefIdx;
  var newRef = newRefIdx;
  var user = keyIdx;
  var date = dateIdx;
  var status = statusIdx;
  firebaseRef.ref(oldRef + user).once('value', function(snap)  {
    firebaseRef.ref(newRef + user).set( snap.val(), function(error) {
      if( !error ) {  firebaseRef.ref(oldRef + user).remove(); }
      else if( typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
    });
  });
  if (status == "accepted") {
    firebaseRef.ref(newRef).child(user).update({
      acceptedBy: currentUser,
      acceptedOn: date
    });
  } else if (status == "deny") {
    firebaseRef.ref(newRef).child(user).update({
      deniedBy: currentUser,
      deniedOn: date
    });
  }

}
