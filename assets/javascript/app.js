// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCFo3FcXuxKpsUVS0K1m00-ZzPCHjkOiGE",
  authDomain: "train-d7ed7.firebaseapp.com",
  databaseURL: "https://train-d7ed7.firebaseio.com",
  projectId: "train-d7ed7",
  storageBucket: "",
  messagingSenderId: "275431718360",
  appId: "1:275431718360:web:08f6676f964007269e86ad"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();

function loadData() {
  var table = $("#train-table");
  table.empty();
  database.ref("train/").on("child_added", function (childSnapshot) {
    
    var trainRow = $("<tr>");
    var edit = $("<td>");
    var editIcon = $("<i>");
    editIcon.addClass("fas");
    editIcon.addClass("fa-edit");
    edit.append(editIcon);
    trainRow.append(edit);
    var deleteTd = $("<td>");
    var deleteIcon = $("<i>");
    deleteIcon.addClass("fas");
    deleteIcon.addClass("fa-trash");
    deleteIcon.addClass("remove");
    deleteIcon.attr("data-key",childSnapshot.key);
    deleteTd.append(deleteIcon);
    trainRow.append(deleteTd);

    var trainNameTd = $("<td>");
    trainNameTd.text(childSnapshot.val().trainName);
    trainRow.append(trainNameTd);

    var destinationTd = $("<td>");
    destinationTd.text(childSnapshot.val().destination);
    trainRow.append(destinationTd);

    var frequencyTd = $("<td>");
    frequencyTd.text(childSnapshot.val().frequency);
    trainRow.append(frequencyTd);

    var nextTrain = findNextArrival(childSnapshot.val().firstTrain, childSnapshot.val().frequency);
    var nextTrainTd = $("<td>");
    nextTrainTd.text(nextTrain.format('LT'));
    trainRow.append(nextTrainTd);

    var minuteAway = nextTrain.diff(moment(), "minutes");
    var minuteAwayTd = $("<td>");
    minuteAwayTd.text(minuteAway);
    trainRow.append(minuteAwayTd);
    table.append(trainRow);
  });
}
function deleteData(){
  var key=$(this).attr("data-key");
  firebase.database().ref('train/'+ key).remove();   
  loadData(); 
}
$(document).on("click",".remove",deleteData);


function findNextArrival(firstTime, tFrequency) {
  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HHmm");
  // Current Time
  var currentTime = moment();
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");

  return nextTrain;
}
setInterval(loadData, 60000);

loadData();
$("#click-button").on("click", function (event) {
  event.preventDefault();

  var trainName = $("#train-name").val().trim();
  var destination = $("#destination").val().trim();
  var firstTrain = $("#first-train").val().trim();
  var frequency = $("#frequency").val().trim();

  database.ref("train/").push({
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  });

  // clear all values from the inputs

});