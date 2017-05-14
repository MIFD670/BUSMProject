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
var currentUnitPosition;
//-------- Roblox API Information --------
var apiKey;
var apiURL;
var groupID = 2520003;
var searchUserID;
var awardList = {
  "Medal of Honor": 'Ribbons/1.png',
  "Army Distinguished Service Cross": 'Ribbons/2.png',
  "Navy Cross": 'Ribbons/3.png',
  "Air Force Cross": 'Ribbons/4.png',
  "Coast Guard Cross": 'Ribbons/5.png',
  "Defense Distinguished Service Medal": 'Ribbons/6.png',
  "Homeland Security Distinguished Service Medal": 'Ribbons/7.png',
  "Distinguished Service Medal (Army)": 'Ribbons/8.png',
  "Navy Distinguished Service Medal": 'Ribbons/9.png',
  "Air Force Distinguished Service Medal": 'Ribbons/10.png',
  "Coast Guard Distinguished Service Medal": 'Ribbons/11.png',
  "Silver Star</option": 'Ribbons/12.png',
  "Defense Superior Service Medal": 'Ribbons/13.png',
  "Legion of Merit": 'Ribbons/14.png',
  "Distinguished Flying Cross": 'Ribbons/15.png',
  "Soldier's Medal": 'Ribbons/16.png',
  "Navy and Marine Corps Medal": 'Ribbons/17.png',
  "Airman's Medal": 'Ribbons/18.png',
  "Coast Guard Medal": 'Ribbons/19.png',
  "Bronze Star Medal": 'Ribbons/20.png',
  "Purple Heart": 'Ribbons/21.png',
  "Defense Meritorious Service Medal": 'Ribbons/22.png',
  "Meritorious Service Medal": 'Ribbons/23.png',
  "Air Medal": 'Ribbons/24.png',
  "Aerial Achievement Medal": 'Ribbons/25.png',
  "Joint Service Commendation Medal": 'Ribbons/26.png',
  "Army Commendation Medal": 'Ribbons/27.png',
  "Navy and Marine Corps Commendation Medal": 'Ribbons/28.png',
  "Air Force Commendation Medal": 'Ribbons/29.png',
  "Coast Guard Commendation Medal": 'Ribbons/30.png',
  "Joint Service Achievement Medal": 'Ribbons/31.png',
  "Army Achievement Medal": 'Ribbons/32.png',
  "Navy and Marine Corps Achievement Medal": 'Ribbons/33.png',
  "Air Force Achievement Medal": 'Ribbons/34.png',
  "Coast Guard Achievement Medal": 'Ribbons/35.png',
  "Commandant's Letter of Commendation": 'Ribbons/36.png',
  "Navy Combat Action Ribbon": 'Ribbons/37.png',
  "Coast Guard Combat Action Ribbon": 'Ribbons/38.png',
  "Air Force Combat Action Medal": 'Ribbons/39.png',
  "Army and Air Force Presidential Unit Citation": 'Ribbons/40.png',
  "Navy and Marine Corps Presidential Unit Citation": 'Ribbons/41.png',
  "Coast Guard Presidential Unit Citation": 'Ribbons/42.png',
  "Joint Meritorious Unit Award": 'Ribbons/43.png',
  "Army Valorous Unit Award": 'Ribbons/44.png',
  "Navy Unit Commendation": 'Ribbons/45.png',
  "Air Force Gallant Unit Citation": 'Ribbons/46.png',
  "Coast Guard Unit Commendation": 'Ribbons/47.png',
  "Army Meritorious Unit Commendation": 'Ribbons/48.png',
  "Navy Meritorious Unit Commendation": 'Ribbons/49.png',
  "Air Force Meritorious Unit Award": 'Ribbons/50.png',
  "Coast Guard Meritorious Unit Commendation":  'Ribbons/51.png',
  "Army Superior Unit Award": 'Ribbons/52.png',
  "Air Force Outstanding Unit Award": 'Ribbons/53.png',
  "Coast Guard Meritorious Team Commendation": 'Ribbons/54.png',
  "Navy E Ribbon": 'Ribbons/55.png',
  "Air Force Organizational Excellence Award": 'Ribbons/56.png',
  "Coast Guard E Ribbon": 'Ribbons/57.png',
  "Prisoner of War Medal": 'Ribbons/58.png',
  "Army Good Conduct Medal": 'Ribbons/59.png',
  "Navy Good Conduct Medal": 'Ribbons/60.png',
  "Air Force Good Conduct Medal": 'Ribbons/61.png',
  "Marine Corps Good Conduct Medal": 'Ribbons/62.png',
  "Coast Guard Good Conduct Medal": 'Ribbons/63.png',
  "Combat Readiness Medal (Air Force)": 'Ribbons/64.png',
  "Outstanding Airman of the Year Ribbon": 'Ribbons/65.png',
  "Coast Guard Enlisted Person of the Year Ribbon": 'Ribbons/66.png',
  "Air Force Recognition Ribbon": 'Ribbons/67.png',
  "Army Reserve Components Achievement Medal": 'Ribbons/68.png',
  "Naval Reserve Meritorious Service Medal": 'Ribbons/69.png',
  "Air Reserve Forces Meritorious Service Medal": 'Ribbons/70.PNG',
  "Selected Marine Corps Reserve Medal": 'Ribbons/71.png',
  "Coast Guard Reserve Good Conduct Medal": 'Ribbons/72.png',
  "Armed Forces Reserve Medal": 'Ribbons/73.png',
  "Navy Expeditionary Medal": 'Ribbons/74.png',
  "Marine Corps Expeditionary Medal": 'Ribbons/75.png',
  "Army of Occupation Medal": 'Ribbons/76.png',
  "Navy Occupation Service Medal": 'Ribbons/77.png',
  "National Defense Service Medal": 'Ribbons/78.png',
  "Global War on Terrorism Service Medal": 'Ribbons/79.png',
  "Korea Defense Service Medal": 'Ribbons/80.png',
  "Armed Forces Service Medal": 'Ribbons/81.png',
  "Humanitarian Service Medal": 'Ribbons/82.png',
  "Outstanding Volunteer Service Medal": 'Ribbons/83.png',
  "Antarctica Service Medal": 'Ribbons/84.png',
  "Coast Guard Arctic Service Medal": 'Ribbons/85.png',
  "Air and Space Campaign Medal": 'Ribbons/86.png',
  "Nuclear Deterrence Operations Service Medal": 'Ribbons/87.png',
  "Armed Forces Expeditionary Medal": 'Ribbons/88.png',
  "Southwest Asia Service Medal": 'Ribbons/90.png',
  "Afghanistan Campaign Medal": 'Ribbons/92.png',
  "Iraq Campaign Medal": 'Ribbons/93.png',
  "Inherent Resolve Campaign Medal": 'Ribbons/94.png',
  "Global War on Terrorism Expeditionary Medal": 'Ribbons/95.png',
  "Navy Sea Service Deployment Ribbon": 'Ribbons/96.png',
  "Coast Guard Sea Service Ribbon": 'Ribbons/97.png',
  "Army Sea Duty Ribbon": 'Ribbons/98.png',
  "Naval Reserve Sea Service Ribbon": 'Ribbons/99.png',
  "Air Force Expeditionary Service Ribbon": 'Ribbons/100.png',
  "Navy Arctic Service Ribbon": 'Ribbons/101.png',
  "Navy and Marine Corps Overseas Service Ribbon": 'Ribbons/102.png',
  "Coast Guard Overseas Service Ribbon": 'Ribbons/103.png',
  "Air Force Overseas Short Tour Service Ribbon": 'Ribbons/104.png',
  "Air Force Overseas Long Tour Service Ribbon": 'Ribbons/105.png',
  "Army Overseas Service Ribbon": 'Ribbons/106.png',
  "Army Reserve Overseas Training Ribbon": 'Ribbons/107.png',
  "Coast Guard Restricted Duty Ribbon": 'Ribbons/108.png',
  "Coast Guard Special Operations Service Ribbon": 'Ribbons/109.png',
  "Air Force Special Duty Ribbon": 'Ribbons/110.png',
  "Air Force Longevity Service Award": 'Ribbons/111.png',
  "Navy Recruiting Service Ribbon": 'Ribbons/112.png',
  "Air Force Recruiter Ribbon": 'Ribbons/113.png',
  "Marine Corps Recruiting Ribbon": 'Ribbons/114.png',
  "Coast Guard Recruiting Service Ribbon": 'Ribbons/115.png',
  "Navy Recruit Training Service Ribbon": 'Ribbons/117.png',
  "Marine Corps Drill Instructor Ribbon": 'Ribbons/118.png',
  "Marine Corps Combat Instructor Ribbon": 'Ribbons/119.png',
  "Navy Ceremonial Guard Ribbon": 'Ribbons/120.png',
  "Marine Corps Security Guard Ribbon": 'Ribbons/121.png',
  "Army NCO Professional Development Ribbon": 'Ribbons/122.png',
  "Air Force NCO PME Graduate Ribbon": 'Ribbons/123.png',
  "Air Force Basic Military Training Honor Graduate Ribbon": 'Ribbons/124.png',
  "Coast Guard Basic Training Honor Graduate Ribbon": 'Ribbons/125.png',
  "Navy Basic Military Training Honor Graduate Ribbon": 'Ribbons/126.png',
  "Army Service Ribbon": 'Ribbons/127.png',
  "Air Force Training Ribbon": 'Ribbons/128.png',
  "Air Force Small Arms Expert Marksmanship Ribbon": 'Ribbons/129.png',
  "Coast Guard Distinguished Marksman Award": 'Ribbons/130.png',
  "Coast Guard Silver Rifle Excellence-in-Competition Award": 'Ribbons/131.png',
  "Coast Guard Bronze Rifle Excellence-in-Competition Award": 'Ribbons/132.png',
  "Navy Expert Rifleman Medal": 'Ribbons/133.png',
  "Coast Guard Expert Rifleman Medal": 'Ribbons/134.png',
  "Navy Rifle Marksmanship Ribbon with Sharpshooter Device": 'Ribbons/135.png',
  "Coast Guard Rifle Marksmanship Ribbon with Sharpshooter Device": 'Ribbons/136.png',
  "Navy Rifle Marksmanship Ribbon": 'Ribbons/137.png',
  "Coast Guard Rifle Marksmanship Ribbon": 'Ribbons/138.png',
  "Coast Guard Distinguished Pistol Shot Award": 'Ribbons/139.png',
  "Coast Guard Silver Pistol Excellence-in-Competition Award": 'Ribbons/140.png',
  "Coast Guard Bronze Pistol Excellence-in-Competition Award": 'Ribbons/141.png',
  "Navy Expert Pistol Shot Medal": 'Ribbons/142.png',
  "Coast Guard Expert Pistol Shot Medal": 'Ribbons/143.png',
  "Navy Pistol Marksmanship Ribbon with Sharpshooter Device": 'Ribbons/144.png',
  "Coast Guard Pistol Marksmanship Ribbon with Sharpshooter Device": 'Ribbons/145.png',
  "Navy Pistol Marksmanship Ribbon": 'Ribbons/146.png',
  "Coast Guard Pistol Marksmanship Ribbon": 'Ribbons/147.png',
  "Operation SideSwipe Campaign Medal": 'Ribbons/148.png',
  "BUSM-BA Conflict Medal": 'Ribbons/149.png',
  "Chairman of Joint Chiefs of Staff Service Medal": 'Ribbons/150.png',
  " Vice Chairman of Joint Chiefs of Staff Service Medal": 'Ribbons/151.png',
  "Senion Enlisted Advisor to the Chairman of Joint Chiefs of Staff Service Medal": 'Ribbons/152.png',
  "Chief of Staff of the Army Service Medal": 'Ribbons/153.png',
  "Vice Chief of Staff of the Army Service Medal": 'Ribbons/154.png',
  "Sergeant Major of the Army Service Medal": 'Ribbons/155.png',
  "Chief of Naval Operations Service Medal": 'Ribbons/156.png',
  "Vice Chief of Naval Operations Service Medal": 'Ribbons/157.png',
  "Master Chief Petty Officer of the Navy Service Medal": 'Ribbons/158.png',
  "Chief of Staff of the Air Force Service Medal": 'Ribbons/159.png',
  "Vice Chief of Staff of the Air Force Service Medal": 'Ribbons/160.png',
  "Command Master Sergeant of the Air Force Service Medal": 'Ribbons/161.png',
  "Commadant of the Marine Corps Service Medal": 'Ribbons/162.png',
  "Assistant Commadant of the Marine Corps Service Medal": 'Ribbons/163.png',
  "Sergeant Major of the Marine Corps Service Medal": 'Ribbons/164.png',
  "Defense Advanced Research Projects Agency Service Medal": 'Ribbons/165.png',
  "Enlisted Service Member of the Quarter Achievement Medal": 'Ribbons/166.png',
  "Warrant Officer of the Quarter Achievement Medal": 'Ribbons/167.png',
  "Officer of the Quarter Achievement Medal": 'Ribbons/168.png',
  "Founder's Meritorious Acheivement Medal": 'Ribbons/169.png',
  "Founder's Distinguished Service Ribbon": 'Ribbons/170.png'
};
var awardListNumber = {
  "Medal of Honor": 1,
  "Army Distinguished Service Cross": 2,
  "Navy Cross": 3,
  "Air Force Cross": 4,
  "Coast Guard Cross": 5,
  "Defense Distinguished Service Medal": 6,
  "Homeland Security Distinguished Service Medal": 7,
  "Distinguished Service Medal (Army)": 8,
  "Navy Distinguished Service Medal": 9,
  "Air Force Distinguished Service Medal": 10,
  "Coast Guard Distinguished Service Medal": 11,
  "Silver Star</option": 12,
  "Defense Superior Service Medal": 13,
  "Legion of Merit": 14,
  "Distinguished Flying Cross": 15,
  "Soldier's Medal": 16,
  "Navy and Marine Corps Medal": 17,
  "Airman's Medal": 18,
  "Coast Guard Medal": 19,
  "Bronze Star Medal":  20,
  "Purple Heart":  21,
  "Defense Meritorious Service Medal": 22,
  "Meritorious Service Medal": 23,
  "Air Medal": 24,
  "Aerial Achievement Medal": 25,
  "Joint Service Commendation Medal": 26,
  "Army Commendation Medal": 27,
  "Navy and Marine Corps Commendation Medal": 28,
  "Air Force Commendation Medal": 29,
  "Coast Guard Commendation Medal": 30,
  "Joint Service Achievement Medal": 31,
  "Army Achievement Medal": 32,
  "Navy and Marine Corps Achievement Medal": 33,
  "Air Force Achievement Medal": 34,
  "Coast Guard Achievement Medal": 35,
  "Commandant's Letter of Commendation": 36,
  "Navy Combat Action Ribbon": 37,
  "Coast Guard Combat Action Ribbon": 38,
  "Air Force Combat Action Medal": 39,
  "Army and Air Force Presidential Unit Citation":  40,
  "Navy and Marine Corps Presidential Unit Citation":  41,
  "Coast Guard Presidential Unit Citation": 42,
  "Joint Meritorious Unit Award": 43,
  "Army Valorous Unit Award": 44,
  "Navy Unit Commendation": 45,
  "Air Force Gallant Unit Citation": 46,
  "Coast Guard Unit Commendation": 47,
  "Army Meritorious Unit Commendation": 48,
  "Navy Meritorious Unit Commendation": 49,
  "Air Force Meritorious Unit Award": 50,
  "Coast Guard Meritorious Unit Commendation": 51,
  "Army Superior Unit Award": 52,
  "Air Force Outstanding Unit Award": 53,
  "Coast Guard Meritorious Team Commendation": 54,
  "Navy E Ribbon": 55,
  "Air Force Organizational Excellence Award": 56,
  "Coast Guard E Ribbon": 57,
  "Prisoner of War Medal": 58,
  "Army Good Conduct Medal": 59,
  "Navy Good Conduct Medal": 60,
  "Air Force Good Conduct Medal": 61,
  "Marine Corps Good Conduct Medal": 62,
  "Coast Guard Good Conduct Medal": 63,
  "Combat Readiness Medal (Air Force)": 64,
  "Outstanding Airman of the Year Ribbon": 65,
  "Coast Guard Enlisted Person of the Year Ribbon": 66,
  "Air Force Recognition Ribbon": 67,
  "Army Reserve Components Achievement Medal": 68,
  "Naval Reserve Meritorious Service Medal": 69,
  "Air Reserve Forces Meritorious Service Medal": 70,
  "Selected Marine Corps Reserve Medal": 71,
  "Coast Guard Reserve Good Conduct Medal": 72,
  "Armed Forces Reserve Medal": 73,
  "Navy Expeditionary Medal": 74,
  "Marine Corps Expeditionary Medal": 75,
  "Army of Occupation Medal": 76,
  "Navy Occupation Service Medal": 77,
  "National Defense Service Medal": 78,
  "Global War on Terrorism Service Medal": 79,
  "Korea Defense Service Medal": 80,
  "Armed Forces Service Medal": 81,
  "Humanitarian Service Medal": 82,
  "Outstanding Volunteer Service Medal": 83,
  "Antarctica Service Medal": 84,
  "Coast Guard Arctic Service Medal": 85,
  "Air and Space Campaign Medal": 86,
  "Nuclear Deterrence Operations Service Medal": 87,
  "Armed Forces Expeditionary Medal": 88,
  "Southwest Asia Service Medal": 90,
  "Afghanistan Campaign Medal": 92,
  "Iraq Campaign Medal": 93,
  "Inherent Resolve Campaign Medal": 94,
  "Global War on Terrorism Expeditionary Medal": 95,
  "Navy Sea Service Deployment Ribbon": 96,
  "Coast Guard Sea Service Ribbon": 97,
  "Army Sea Duty Ribbon": 98,
  "Naval Reserve Sea Service Ribbon": 99,
  "Air Force Expeditionary Service Ribbon": 100,
  "Navy Arctic Service Ribbon": 101,
  "Navy and Marine Corps Overseas Service Ribbon": 102,
  "Coast Guard Overseas Service Ribbon": 103,
  "Air Force Overseas Short Tour Service Ribbon": 104,
  "Air Force Overseas Long Tour Service Ribbon": 105,
  "Army Overseas Service Ribbon": 106,
  "Army Reserve Overseas Training Ribbon": 107,
  "Coast Guard Restricted Duty Ribbon": 108,
  "Coast Guard Special Operations Service Ribbon": 109,
  "Air Force Special Duty Ribbon": 110,
  "Air Force Longevity Service Award": 111,
  "Navy Recruiting Service Ribbon": 112,
  "Air Force Recruiter Ribbon": 113,
  "Marine Corps Recruiting Ribbon": 114,
  "Coast Guard Recruiting Service Ribbon": 115,
  "Navy Recruit Training Service Ribbon": 117,
  "Marine Corps Drill Instructor Ribbon": 118,
  "Marine Corps Combat Instructor Ribbon": 119,
  "Navy Ceremonial Guard Ribbon": 120,
  "Marine Corps Security Guard Ribbon": 121,
  "Army NCO Professional Development Ribbon": 122,
  "Air Force NCO PME Graduate Ribbon": 123,
  "Air Force Basic Military Training Honor Graduate Ribbon": 124,
  "Coast Guard Basic Training Honor Graduate Ribbon": 125,
  "Navy Basic Military Training Honor Graduate Ribbon": 126,
  "Army Service Ribbon": 127,
  "Air Force Training Ribbon": 128,
  "Air Force Small Arms Expert Marksmanship Ribbon": 129,
  "Coast Guard Distinguished Marksman Award": 130,
  "Coast Guard Silver Rifle Excellence-in-Competition Award": 131,
  "Coast Guard Bronze Rifle Excellence-in-Competition Award": 132,
  "Navy Expert Rifleman Medal": 133,
  "Coast Guard Expert Rifleman Medal": 134,
  "Navy Rifle Marksmanship Ribbon with Sharpshooter Device": 135,
  "Coast Guard Rifle Marksmanship Ribbon with Sharpshooter Device": 136,
  "Navy Rifle Marksmanship Ribbon": 137,
  "Coast Guard Rifle Marksmanship Ribbon": 138,
  "Coast Guard Distinguished Pistol Shot Award": 139,
  "Coast Guard Silver Pistol Excellence-in-Competition Award": 140,
  "Coast Guard Bronze Pistol Excellence-in-Competition Award": 141,
  "Navy Expert Pistol Shot Medal": 142,
  "Coast Guard Expert Pistol Shot Medal": 143,
  "Navy Pistol Marksmanship Ribbon with Sharpshooter Device": 144,
  "Coast Guard Pistol Marksmanship Ribbon with Sharpshooter Device": 145,
  "Navy Pistol Marksmanship Ribbon": 146,
  "Coast Guard Pistol Marksmanship Ribbon": 147,
  "Operation SideSwipe Campaign Medal": 148,
  "BUSM-BA Conflict Medal": 149,
  "Chairman of Joint Chiefs of Staff Service Medal": 150,
  " Vice Chairman of Joint Chiefs of Staff Service Medal": 151,
  "Senion Enlisted Advisor to the Chairman of Joint Chiefs of Staff Service Medal": 152,
  "Chief of Staff of the Army Service Medal": 153,
  "Vice Chief of Staff of the Army Service Medal": 154,
  "Sergeant Major of the Army Service Medal": 155,
  "Chief of Naval Operations Service Medal": 156,
  "Vice Chief of Naval Operations Service Medal": 157,
  "Master Chief Petty Officer of the Navy Service Medal": 158,
  "Chief of Staff of the Air Force Service Medal": 159,
  "Vice Chief of Staff of the Air Force Service Medal": 160,
  "Command Master Sergeant of the Air Force Service Medal": 161,
  "Commadant of the Marine Corps Service Medal": 162,
  "Assistant Commadant of the Marine Corps Service Medal": 163,
  "Sergeant Major of the Marine Corps Service Medal": 164,
  "Defense Advanced Research Projects Agency Service Medal": 165,
  "Enlisted Service Member of the Quarter Achievement Medal": 166,
  "Warrant Officer of the Quarter Achievement Medal": 167,
  "Officer of the Quarter Achievement Medal": 168,
  "Founder's Meritorious Acheivement Medal": 169,
  "Founder's Distinguished Service Ribbon": 170
};


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
      // Do nothing
      console.log('The user has the necessary administrative access');
    } else if (admin == "mod") {
      $("#edit_User_Paygrade option[value='JCS']")
      .attr("disabled", "disabled")
      .siblings().removeAttr("disabled");
    } else if (admin == "normal") {
      $("#edit_User_Paygrade option[value='VJCS']")
      .attr("disabled", "disabled")
      .siblings().removeAttr("disabled");
      $("#edit_User_Paygrade option[value='JCS']")
      .attr("disabled", "disabled")
      .siblings().removeAttr("disabled");
    }

    if ((admin == "owner") || (admin == "superAdmin") || (admin == "admin") || (admin == "mod")) {
      $('#loader_Container').css('display', 'none');
      $('#main_Container').css('display', 'block');
    } else {
      $('#loader_Container').css('display', 'block');
      $('#main_Container').css('display', 'none');
    }
  });
  // Find the API Information
  firebaseRef.ref('/ServerSettings/').once('value').then(function(snapshot) {
    apiKey = snapshot.child('apiKey').val();
    apiURL = snapshot.child('apiURL').val();
    console.log('API KEY: ' + apiKey + ', API URL: ' + apiURL);
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
  var newStatus = $('#edit_User_Status option:selected').text();
  var newCurrentUnitPosition = $('#edit_User_CurrentUnit_Pos').val();
  var date = getCurrentDate();
  console.log('Current paygrade is: ' + paygrade);
  console.log('New paygrade is: ' + newPaygrade);

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
  if ((newStatus == null) || (newStatus == "Select User Status")){
    $('#edit_User_Error').html('Error: Status value invalid. Please select a valid military status.');
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
  rank = getRank(newPaygrade, newBranch);
  firebase.database().ref('Users/' + username).update({
    branch: newBranch,
    paygrade: newPaygrade,
    rank: rank
  });
  if (newCurrentUnitPosition != currentUnitPosition) {
    firebaseRef.ref('/Users/' + username).update({
      currentUnitPosition: newCurrentUnitPosition
    });
  } else {
    console.log('No new unit positions.');
  }
  if (newStatus != userStatus) {
    firebaseRef.ref('/Users/' + username).update({
      status: newStatus
    });
    var description = "Change of status from " + userStatus + " to " + newStatus + ".";
    var activityHistory = {
      username: username,
      type: "Change of Status",
      description: description,
      date: date,
      sponsor: currentUser
    };
    var activityHistoryKey = firebaseRef.ref('/Users/' + username + '/activity').push().key;
    firebaseRef.ref('/Users/' + username + '/activity').child(activityHistoryKey).update(activityHistory);
  } else {
    console.log('No new status.');
  }
  // If there is a new pay-grade being updated, then send the data to Firebase promotions
  if (newPaygrade != paygrade) {
    var promotionHistory = {
      username: username,
      promotion: newPaygrade,
      date: date,
      promotedBy: currentUser
    };
    promotionKey = firebaseRef.ref('/Users/' + username + '/promotions').push().key;
    console.log('Promotion Key: ' + promotionKey);
    firebaseRef.ref('/Users/' + username + '/promotions').child(promotionKey).update(promotionHistory);
    console.log('Promotion added.');
    console.log('Units added.');
    console.log('The current user ID: ' + searchUserID);
    setRank(searchUserID, username, newPaygrade, newCurrentUnit);
  } else {
    console.log('The paygrades equal to eachother.');
  }
  // If there is a new unit being updated, then send the data to Firebase unit history
  if (newCurrentUnit !== currentUnit) {
    var unitHistory = {
      username: username,
      branch: newBranch,
      unit: newCurrentUnit,
      unitPosition: newCurrentUnitPosition,
      entranceDate: date,
      departureDate: 'UPDATE'
    };
    newUnitKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
    firebaseRef.ref('/Users/' + username + '/units').child(newUnitKey).update(unitHistory);
    firebaseRef.ref('/Users/' + username).update({
      currentUnit: newCurrentUnit,
      currentUnitKey: newUnitKey,
      currentUnitPosition: newCurrentUnitPosition
    });
  } else {
    console.log('No new units were added.');
  }
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
  var award = $('#add_User_Award').val();
  var image = getAwardURL(award);
  var awardNumber = getAwardNumber(award);
  console.log('The image is: ' + image);
  var citation = $('#award_Description').val();
  var date = getCurrentDate();
  var awardToAdd = {
    awardName: award,
    awardImage: image,
    citation: citation,
    dateAwarded: date,
    awardedBy: currentUser
  };
  if ((award.length == 0) || (award == null)){
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
  firebaseRef.ref('/Users/' + username + '/awards').child(awardNumber).update(awardToAdd);
  $('#add_User_Award').val('');
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
  var unitPosition = $('#add_User_Unit_Position').val();
  var entranceDate = $('#add_User_Unit_Date').val();
  var actualDepartureDate;
  var departureDate = $('#add_User_Unit_Date_Depart').val();
  var currentlyServing;

  if ((branch.length == 0) || (unitName.length == 0) || (unitPosition.length == 0) || (!entranceDate)) {
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
    unitPosition: unitPosition,
    entranceDate: entranceDate,
    departureDate: actualDepartureDate
  };
  console.log('Passed, and all values do exist.');
  unitHistoryKey = firebaseRef.ref('/Users/' + username + '/units').push().key;
  firebaseRef.ref('/Users/' + username + '/units').child(unitHistoryKey).update(unitToAdd);

  $('#unit_User_Error').css('display', 'none');
  $('#unit_User_Error').text('');
  $('#add_User_Unit_Name').val('');
  $('#add_User_Unit_Position').val('');
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
  } else if(strPaygrade == "E-9B" && (branch == "Coast Guard")) {
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

function getAwardURL(awardIdx) {
  var award = awardIdx;
  var returnAward;
  console.log(award);
  returnAward = awardList[award];
  return returnAward;
}

function getAwardNumber(awardIdx) {
  var award = awardIdx;
  var returnNumber;
  console.log(award);
  returnNumber = awardListNumber[award];
  return returnNumber;
}

function setRank(userIDIdx, usernameIdx, paygradeIdx, unitIdx) {
  var strPaygrade = paygradeIdx;
  var strUserID = userIDIdx;
  var strUsername = usernameIdx;
  var strUnit = unitIdx;
  var formattedRank;

  if (strPaygrade == "E-1") {
    formattedRank = 231;
  } else if ((strPaygrade == "E-2") || (strPaygrade == "E-3")) {
    formattedRank = 236;
  } else if ((strPaygrade == "E-4") || (strPaygrade == "E-5")) {
    formattedRank = 237;
  } else if ((strPaygrade == "E-6") || (strPaygrade == "E-7")) {
    formattedRank = 238;
  } else if ((strPaygrade == "E-8") || (strPaygrade == "E-9")) {
    formattedRank = 239;
  } else if (strPaygrade == "SEA") {
    formattedRank = 240;
  } else if ((strPaygrade == "O-1") || (strPaygrade == "O-2")) {
    formattedRank = 242;
  } else if ((strPaygrade == "O-3") || (strPaygrade == "O-4")) {
    formattedRank = 243;
  } else if ((strPaygrade == "O-5") || (strPaygrade == "O-6")) {
    formattedRank = 244;
  } else if ((strPaygrade == "O-7") || (strPaygrade == "O-8")) {
    formattedRank = 245;
  } else if (strPaygrade == "O-9") {
    formattedRank = 246;
  } else if (strPaygrade == "O-10") {
    formattedRank = 248;
  } else if ((strPaygrade == "VJCS") && ((strUnit == "HQDA") || (strUnit == "HQDN") || (strUnit == "HQMC") || (strUnit == "HQAF") || (strUnit == "HQCG"))) {
    formattedRank = 249;
  } else if ((strPaygrade == "JCS") && ((strUnit == "HQDA") || (strUnit == "HQDN") || (strUnit == "HQMC") || (strUnit == "HQAF") || (strUnit == "HQCG"))) {
    formattedRank = 250;
  } else if ((strPaygrade == "VJCS") && ((strUnit == "HQDA") || (strUnit == "HQDN") || (strUnit == "HQMC") || (strUnit == "HQAF") || (strUnit == "HQCG"))) {
    formattedRank = 249;
  }
  console.log('The role ID is: ' + formattedRank);
  var data = {};
  data.key = apiKey;
  var postURL = "https://" + apiURL + "/setRank/" + groupID + "/" + strUserID + "/" + formattedRank;
  var date = getCurrentDate();

  $.ajax({
    url: postURL,
    method: 'POST',
    data: data,
    dataType: "json",
    success: function () {
      Materialize.toast('Successfully Updated Group Rank!', 4000);
      var keyToLogs = firebaseRef.ref('Logs').push().key;
      var log = 'Admin user (' + currentUser + ') promoted user (' + strUsername + ') in group [BUSM] on ' + date + '.';
      firebaseRef.ref('Logs').child(keyToLogs).update({
        date: date,
        log: log
      });
      console.log('The ranking was a success.');
    }
  });

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

    //Get the User ID
    var endText = '&format=json';
    var apiPassThruUrl = "https://polar-garden-75406.herokuapp.com/apiPassThru.php";
    var robloxBaseURL = 'https://api.roblox.com/users/get-by-username?username=';
    var key = "";
    var searchURL = robloxBaseURL + userIdx + endText;
    // Retrieves Data
    $.ajax({
      url: apiPassThruUrl,
      dataType: 'json',
      method: 'GET',
      data: {"apiEndpoint": searchURL,
      "key": key
    /*"format": "json"*/}
  }).done (function (data) {
    id = data['Id'];
    setUserID(id);
    /*$.each(data['bustime-response']['prd'], function (i, v) {
    $('body').append("Route ID: " + v.rt + ", Bus Stop: " + v.stpid + ", ETA: " + v.prdctdn);
  })*/
});

//Remove from here and add to the function where it checks if it does exist
firebaseRef.ref('/Users/' + user).once('value').then(function(snapshot) {
  var username = user;
  currentUnit = snapshot.child('currentUnit').val();
  currentUnitPosition = snapshot.child('currentUnitPosition').val();
  branch = snapshot.child('branch').val();
  paygrade = snapshot.child('paygrade').val();
  userStatus = snapshot.child('status').val();
  var currentUnitKey = snapshot.child('currentUnitKey').val();
  console.log('1: ' + user + ', 2: ' + currentUnit + ', 3: ' + branch + ', 4: ' + paygrade + ', 5: ' + currentUnitKey);
  $('#edit_User_Username').val(username);
  $('#edit_User_Username_Label').addClass('active');
  $('#edit_User_CurrentUnit').val(currentUnit);
  $('#edit_User_CurrentUnit_Label').addClass('active');
  $('#edit_User_CurrentUnit_Pos').val(currentUnitPosition);
  $('#edit_User_CurrentUnit_Pos_Label').addClass('active');
  $('#edit_User_CurrentUnit_Key').val(currentUnitKey);
  $('#edit_User_CurrentUnit_Key_Label').addClass('active');
  $("#edit_User_Branch option[value=" + branch + "]").attr("selected", true);
  $("#edit_User_Status option[value=" + userStatus + "]").attr("selected", true);
  $("#edit_User_Paygrade option[value=" + paygrade + "]").attr("selected", true);
  $('#edit_User_Branch').material_select();
  $('#edit_User_Paygrade').material_select();
  $('#edit_User_Status').material_select();
});

firebaseRef.ref('/Users/' + user + '/units').orderByChild("departureDate").on("child_added", snap => {
  var username = capitalizeFirstLetter(user);
  var currentUnitKey = snap.key;
  var unit = snap.child('unit').val();
  var currentPosition = snap.child('unitPosition').val();
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
  newCard.find('#user_History_Unit_Position').html('Position: ' + currentPosition);
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
    newCard.find('#user_History_Unit_Position').replaceWith("<div class='input-field inline'><input class='white-text' id='update_Unit_Pos' type='text'></input><label for='update_Unit_Pos' class='active white-text'>Position</label></div>");
    newCard.find('#update_Unit_Pos').val(currentPosition);
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
      var updatePosition = $('#update_Unit_Pos').val();
      console.log('Update Position: ' + updatePosition);
      var key = currentUnitKey;
      console.log(key);
      console.log(username);
      // This function updates the key and stores it in the Firebase database
      firebaseRef.ref('/Users/' + username.toLowerCase() + '/units/' + key).update({
        username: username,
        branch: updateBranch,
        unit: updateUnit,
        unitPosition: updatePosition,
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
      newCardInside.find('#user_History_Unit_Position').html('Position: ' + updatePosition);
      newCardInside.find('#user_History_Unit_Key').html('Key: ' + currentUnitKey);
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
      newCardInside.find('#user_History_Unit_Position').html('Position: ' + currentPosition);
      newCardInside.find('#user_History_Entrance').html('Entrance Date: ' + entranceDate);
      newCardInside.find('#user_History_Departure').html('Departure Date: ' + departureDate);
      newCard.find('#card_Inside').remove();
      newCard.append(newCardInside);
      console.log('Disregard!');
    });
  });
});
//REMOVE APRIL 30th, 2017
firebaseRef.ref('/Users/' + user + '/promotions').orderByChild("departureDate").on("child_added", snap => {
  var username = capitalizeFirstLetter(user);
  var currentPromotionKey = snap.key;
  var promotion = snap.child('promotion').val();
  var promotedBy = snap.child('promotedBy').val();
  var promotionDate = snap.child('date').val();
  // Console logs
  console.log('USERNAME: ' + username + ", PROMOTION: " + promotion + ", PROMOTED BY: " + promotedBy + ", DATE: " + promotionDate);
  // Creates a clone of the vocab card to edit
  var newCard = $('#user_Card_Promotion').clone();
  newCard.removeAttr('id');
  newCard.find('.card-title').text(username);
  newCard.find('#user_Promotion').html('Promotion to: ' + promotion);
  newCard.find('#user_PromotedBy').html('Promoted by: ' + promotedBy);
  newCard.find('#user_Promotion_Key').html('Promotion Key: ' + currentPromotionKey);
  newCard.find('#user_PromotedOn').html('Promotion Date: ' + promotionDate);
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
    newCard.find('#user_Promotion').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_PromotionTo' type='text'></input><label for='update_Branch' class='active white-text'>Promotion to</label></div>");
    newCard.find('#update_PromotionTo').val(promotion);
    newCard.find('#user_PromotedBy').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_PromotedBy' type='text'></input><label for='update_Unit' class='active white-text'>Promoted by</label></div>");
    newCard.find('#update_PromotedBy').val(promotedBy);
    newCard.find('#user_Promotion_Key').replaceWith("<div class='input-field inline'><input class='white-text' disabled id='update_Key' type='text'></input><label for='update_Key' class='active white-text'>Promotion Key</label></div>");
    newCard.find('#update_Key').val(currentPromotionKey);
    newCard.find('#user_PromotedOn').replaceWith("<div class='input-field inline'><input class='white-text' id='update_PromotionDate' type='text'></input><label for='update_Entrance' class='active white-text'>Promotion Date (MM-DD-YYYY)</label></div>");
    newCard.find('#update_PromotionDate').val(promotionDate);
    newCard.find('.card-action').css("display", "block");
    // Does indeed update
    newCard.find('#update_button').on("click", function() {
      var updatePromotion = $('#update_PromotionTo').val();
      //console.log('Update Branch: ' + updateBranch);
      var updatePromotionBy = $('#update_PromotedBy').val();
      //console.log('Update Unit: ' + updateUnit);
      var updatePromotionDate = $('#update_PromotionDate').val();
      //console.log('Update Entrance: ' + updateEntrance);
      var key = currentPromotionKey;
      console.log(key);
      console.log(username);
      // This function updates the key and stores it in the Firebase database
      firebaseRef.ref('/Users/' + username.toLowerCase() + '/promotions/' + key).update({
        username: username,
        promotion: updatePromotion,
        promotedBy: updatePromotionBy,
        date: updatePromotionDate,
      });
      console.log('The promotion information has been UPDATED');
      // Returns the card back to normal with updated stuff
      var newCardInside = $('#card_Inside_Promotion').clone();
      console.log("The Upgrade button works!")
      newCardInside.find('.card-title').text(username);
      newCardInside.find('#user_Promotion').html('Promotion to: ' + updatePromotion);
      newCardInside.find('#user_PromotedBy').html('Promoted by: ' + updatePromotionBy);
      newCardInside.find('#user_Promotion_Key').html('Promotion Key: ' + key);
      newCardInside.find('#user_PromotedOn').html('Promotion Date: ' + updatePromotionDate);
      // Hides the "Card-Action" and removes the "editable" view of the cards
      newCard.find('.card-action').css("display", "none");
      newCard.find('#card_Inside_Promotion').remove();
      // Appends the new, updated "normal" view of the user cards
      newCard.append(newCardInside);
      Materialize.toast('Promotion History Updated!&nbsp<b><u><a href="">Reload</a></u></b>', 5000);
    });
    // Disregards update
    newCard.find('#disregard_button').on("click", function() {
      var newCardInside = $('#card_Inside_Promotion').clone();
      console.log("The Disregard Upgrade button works!");
      newCardInside.find('.card-title').text(username);
      newCardInside.find('#user_Promotion').html('Promotion to: ' + promotion);
      newCardInside.find('#user_PromotedBy').html('Promoted by: ' + promotedBy);
      newCardInside.find('#user_Promotion_Key').html('Promotion Key: ' + currentPromotionKey);
      newCardInside.find('#user_PromotedOn').html('Promotion Date: ' + promotionDate);
      newCard.find('#card_Inside_Promotion').remove();
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

function setUserID(userIDx) {
  searchUserID = userIDx;
  console.log('current user id is : ' + searchUserID);
}
