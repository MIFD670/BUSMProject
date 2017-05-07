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
    var admin = snapshot.child('admin').val();
    var userAdmin = capitalizeFirstLetter(snapshot.child('admin').val());
    var branch = snapshot.child('branch').val();
    currentUserBranch = snapshot.child('branch').val();
    currentAdmin = snapshot.child('admin').val();
    console.log('USERNAME: ' + username + ', BRANCH: ' + branch + ', ACCOUNT TYPE: ' + userAdmin);

    $('#user_Information_Username').html('Username: <em class="blue-text text-darken-1">' + username + '</em>');
    $('#user_Information_Branch').html('Branch: <em class="blue-text text-darken-1">' + branch + '</em>');
    $('#user_Information_Admin').html('Access Level: <em class="blue-text text-darken-1">' + userAdmin + '</em>');
    if ((admin == "owner") || (admin == "superAdmin") || (admin == "admin") || (admin == "mod")) {
      $('#loader_Container').css('display', 'none');
      $('#main_Container').css('display', 'block');
    } else {
      $('#loader_Container').css('display', 'block');
      $('#main_Container').css('display', 'none');
    }
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
  });
console.log('Display content length');
var cardNumberAF = $('#af_Section #af_Card_Holder .card-panel').length;
var newCardNumberAF = cardNumberAF - 1;
var cardNumberArmy = $('#army_Section #army_Card_Holder .card-panel').length;
var cardNumberCG = $('#cg_Section #cg_Card_Holder .card-panel').length;
var cardNumberMC = $('#mc_Section #mc_Card_Holder .card-panel').length;
var cardNumberNavy = $('#navy_Section #navy_Card_Holder .card-panel').length;
$('#airForce_Text').text('Air Force Personnel (' + newCardNumberAF + ')');
$('#army_Text').text('Army Personnel (' + cardNumberArmy + ')');
$('#coastGuard_Text').text('Coast Guard Personnel (' + cardNumberCG + ')');
$('#marineCorps_Text').text('Marine Corps Personnel (' + cardNumberMC + ')');
$('#navy_Text').text('Navy Personnel (' + cardNumberNavy + ')');
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
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}
