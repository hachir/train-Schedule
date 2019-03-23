
var config = {
    apiKey: "AIzaSyDW7wriLIY85FDOeZz002aNjyELF9jAKVI",
    authDomain: "fir-train-schedule-c20e7.firebaseapp.com",
    databaseURL: "https://fir-train-schedule-c20e7.firebaseio.com",
    projectId: "fir-train-schedule-c20e7",
    storageBucket: "fir-train-schedule-c20e7.appspot.com",
    messagingSenderId: "1089238806371"
};
firebase.initializeApp(config);
var database = firebase.database();
var currentTime = moment();

database.ref().on("value", function(snapshot) {
    $('.table tbody').html("")
    var trains = snapshot.val();
    for (var trainName in trains) {
        var train =trains[trainName]; // is each trin object one at a times
        var tFrequency = train.frequency;
        var firstTime = train.firstTrain
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
        var nextArrival = moment(nextTrain).format("hh:mm")

        $('.table tbody').append(`
            <tr>
                <td>${train.name}</td>
                <td>${train.destination}</td>
                <td>${train.frequency}</td>
                <td>${tMinutesTillTrain}</td>
                <td>${nextArrival}</td>
            </tr>
        `);
    }
});
$("#addTrainBtn").on("click", function() {

    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();
    if (trainName == "") {
        alert('Enter a train name.');
        return false;
    }
    if (destination == "") {
        alert('Enter a destination.');
        return false;
    }
    if (firstTrain == "") {
        alert('Enter a first train time.');
        return false;
    }
    if (frequency == "") {
        alert('Enter a frequency');
        return false;
    }
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract("1, years");
    var difference = currentTime.diff(moment(firstTrainConverted), "minutes");
    var remainder = difference % frequency;
    var minUntilTrain = frequency - remainder;
    var nextTrain = moment().add(minUntilTrain, "minutes").format("hh:mm a");

    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        min: minUntilTrain,
        next: nextTrain
    }

    console.log(newTrain);
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destinationInput").val("");
    $("#firstInput").val("");
    $("#frequencyInput").val("");

    return false;
});