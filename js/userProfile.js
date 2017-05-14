//Global Variables
var usernameSearched;
$(document).ready(function() {
  //Get the username from link
  usernameSearched = getUsernameFromLink()["username"].toLowerCase();
  console.log(usernameSearched);
  displayData(usernameSearched);
});

function getUsernameFromLink() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

function displayData(userIdx) {
  var username = userIdx;
  // General Data
  firebaseRef.ref('/Users/' + username).once('value').then(function(snapshot) {
    var username = capitalizeFirstLetter(snapshot.key);
    var unit = snapshot.child('currentUnit').val();
    var branch = snapshot.child('branch').val();
    var paygrade = snapshot.child('paygrade').val();
    var rank = snapshot.child('rank').val();
    var profilePicture = snapshot.child('profilePic').val();
    var dutyStatus = snapshot.child('status').val();
    console.log('1: ' + username + ', 2: ' + unit + ', 3: ' + branch + ', 4: ' + paygrade + ', 5: ' + rank + ', 6: ' + profilePicture);
    //Display Data
    $('#username').html(username + ' ');
    $('#search_Img').attr('src', profilePicture);
    $('#rank').html('Rank: ' + rank);
    $('#paygrade').html('Pay-Grade: ' + paygrade);
    $('#branch').html('Branch: ' + branch);
    $('#unit').html('Unit: ' + unit);
    if (dutyStatus == "Active Duty") {
      $('#status').html(dutyStatus);
      $('#status').addClass('green');
    } else if (dutyStatus == "Reserves") {
      $('#status').html(dutyStatus);
      $('#status').addClass('orange darken-1');
    } else if (dutyStatus == "Inactive Ready Reserves") {
      $('#status').html(dutyStatus);
      $('#status').removeClass('white-text');
      $('#status').addClass('yellow');
    } else if (dutyStatus == "Medical Leave") {
      $('#status').html(dutyStatus);
      $('#status').addClass('cyan darken-1');
    } else if (dutyStatus == "Administrative Leave") {
      $('#status').html(dutyStatus);
      $('#status').addClass('amber darken-1');
    } else if (dutyStatus == "Pending Court Martial") {
      $('#status').html(dutyStatus);
      $('#status').addClass('pink darken-1');
    } else if (dutyStatus == "Pending Dishonorable Discharge") {
      $('#status').html(dutyStatus);
      $('#status').addClass('red darken-3');
    } else if (dutyStatus == "Pending Other Action") {
      $('#status').html(dutyStatus);
      $('#status').addClass('deep-purple darken-1');
    } else if (dutyStatus == "AWOL") {
      $('#status').html(dutyStatus);
      $('#status').removeClass('white-text');
    } else if (dutyStatus.length < 3) {
      $('#status').remove();
    }
  });
  //Awards
  firebaseRef.ref('/Users/' + username + '/awards').on("child_added", snap => {
    var awardedBy = capitalizeFirstLetter(snap.child('awardedBy').val());
    var usernameAward = capitalizeFirstLetter(username);
    var awardName = snap.child('awardName').val();
    var awardImage = snap.child('awardImage').val();
    var citation = snap.child('citation').val();
    var dateAwarded = snap.child('dateAwarded').val();
    var awardNumber = snap.key;
    // Console logs
    console.log('Award Name: ' + awardName + ', Awarded By: ' + awardedBy + ', Award Image: ' + awardImage + ', Citation: ' + citation + ', Date Awarded: ' + dateAwarded + ', Number: ' + awardNumber);
    // Creates a clone of the vocab card to edit
    var newRibbon = $('#ribbons_Image').clone();
    newRibbon.removeAttr('id');
    newRibbon.attr('src', awardImage);
    newRibbon.attr('data-tooltip', awardName + ' awarded to ' + usernameAward + ' by ' + awardedBy + ' on ' + dateAwarded);
    newRibbon.tooltip();
    newRibbon.css('display', 'inline');
    newRibbon.show();
    //Appends to "approved section"
    $('#ribbons_Holder').append(newRibbon);
    $('#award_Error').css('display', 'none');
    $('#ribbons_Holder').css('display', 'block');
  });
  //Promotion Records
  firebaseRef.ref('/Users/' + username + '/promotions').orderByChild('date').on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.child('username').val());
    var promotion = snap.child('promotion').val();
    var promotedBy = capitalizeFirstLetter(snap.child('promotedBy').val());
    var date = snap.child('date').val();
    // Console logs
    console.log('Username: ' + username + ', promotion: ' + promotion + ', promoted by: ' + promotedBy + ', date: ' + date);
    // Creates a clone of the vocab card to edit
    var newInfo = $('#promotionInformation').clone();
    newInfo.removeAttr('id');
    newInfo.find('#promotion_User').text(username);
    newInfo.find('#promotion_Grade').text(promotion);
    newInfo.find('#promotion_Date').text(date);
    newInfo.find('#promotion_By_User').text(promotedBy);
    newInfo.css('display', '');
    //Appends to "approved section"
    $('#promotion_Holder').prepend(newInfo);
    //$('#award_Error').css('display', 'none');
    //$('#promotionInformation').remove();
    $('#promotionHead').css('display', '');
    $('#promotion_Holder').show();
  });
  //Activity Records
  firebaseRef.ref('/Users/' + username + '/activity').orderByChild('date').on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.child('username').val());
    var type = capitalizeFirstLetter(snap.child('type').val());
    var description = snap.child('description').val();
    var sponsor = capitalizeFirstLetter(snap.child('sponsor').val());
    var date = snap.child('date').val();
    // Console logs
    //console.log('Username: ' + username + ', promotion: ' + promotion + ', promoted by: ' + promotedBy + ', date: ' + date);
    // Creates a clone of the vocab card to edit
    var newInfo = $('#activityInformation').clone();
    newInfo.removeAttr('id');
    newInfo.find('#activity_User').text(username);
    newInfo.find('#activity_Type').text(type);
    newInfo.find('#activity_Description').text(description);
    newInfo.find('#activity_Sponsor').text(sponsor);
    newInfo.find('#activity_Date').text(date);
    newInfo.css('display', '');
    //Appends to "approved section"
    $('#activity_Holder').prepend(newInfo);
    //$('#award_Error').css('display', 'none');
    //$('#promotionInformation').remove();
    $('#activityHead').css('display', '');
    $('#activity_Holder').show();
  });
  //Unit Records
  firebaseRef.ref('/Users/' + username + '/units').orderByChild('departureDate').on("child_added", snap => {
    var username = capitalizeFirstLetter(snap.child('username').val());
    var branch = snap.child('branch').val();
    var unit = snap.child('unit').val();
    var position = capitalizeFirstLetter(snap.child('unitPosition').val());
    var entranceDate = snap.child('entranceDate').val();
    var departureDate = snap.child('departureDate').val();
    // Console logs
    //console.log('Username: ' + username + ', promotion: ' + promotion + ', promoted by: ' + promotedBy + ', date: ' + date);
    // Creates a clone of the vocab card to edit
    var newInfo = $('#unitInformation').clone();
    newInfo.removeAttr('id');
    newInfo.find('#unit_User').text(username);
    newInfo.find('#unit_Branch').text(branch);
    newInfo.find('#unit_Unit').text(unit);
    newInfo.find('#unit_Unit_Pos').text(position);
    newInfo.find('#unit_Entrance').text(entranceDate);
    newInfo.find('#unit_Departure').text(departureDate);
    newInfo.css('display', '');
    //Appends to "approved section"
    $('#unit_Holder').prepend(newInfo);
    //$('#award_Error').css('display', 'none');
    //$('#promotionInformation').remove();
    $('#unitHead').css('display', '');
    $('#unit_Holder').show();
  });
  getData();
}

function getData() {
  console.log('Spinner Working');
  setTimeout(display, 3000);
}

function display() {
  $('#loader_Container').css('display', 'none');
  $('#data_Container').css('display', 'block');
}

function capitalizeFirstLetter(wordIdx) {
  //Capitalizes the first letter of a word
  var word = wordIdx;
  var newWord;
  newWord = word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  console.log(newWord);
  return newWord;
}
