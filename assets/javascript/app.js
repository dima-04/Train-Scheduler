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


// database ref(same as the train) on("value", function(snapshot))
database.ref("train/").on("child_added", function (childSnapshot) {

  var table = $("#train-table");

  var trainRow = $("<tr>");
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

var minuteAway= nextTrain.diff(moment(),"minutes");
var minuteAwayTd = $("<td>");
minuteAwayTd.text(minuteAway);
trainRow.append(minuteAwayTd);
  table.append(trainRow);
});

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