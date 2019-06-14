var firebaseConfig = {
    apiKey: "AIzaSyDB5JzQTfjP-nA-apX57sMZ45zLpBrR-kc",
    authDomain: "trainscheduler-cc782.firebaseapp.com",
    databaseURL: "https://trainscheduler-cc782.firebaseio.com",
    projectId: "trainscheduler-cc782",
    storageBucket: "trainscheduler-cc782.appspot.com",
    messagingSenderId: "134795464579",
    appId: "1:134795464579:web:fe6c6971e67dec4a"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var name;
var destination;
var time;
var frequency;
var minutesAway;
var nextArrival;

database.ref().on("value", function (snapshot) {
    var valueForTrain = snapshot.val();
    if (snapshot.child("name").exists() && snapshot.child("destination").exists()) {
        name = valueForTrain.name;
        destination = valueForTrain.destination;
        time = valueForTrain.time;
        frequency = parseInt(valueForTrain.frequency);
        console.log(name, destination);
    } else {
        console.log(name, destination);
    }
}, function (errorObject) {
    console.log("Read failed: " + errorObject.code);
});

$(".start").on("click", function (event) {
    event.preventDefault();
    name = $("#name").val();
    destination = $("#destination").val();
    time = $("#time-start").val();
    frequency = parseInt($("#frequency").val());
    console.log(name,destination,time,frequency)
    var newTrain = {
        nameTrain: name,
        destTrain: destination,
        timeTrain: time,
        freqTrain: frequency
    }

    database.ref().push(newTrain);
    console.log(newTrain);

    $("#name").val("");
    $("#destination").val("");
    $("#time-start").val("");
    $("#frequency").val("");
});

database.ref().on("child_added", function (childSnapshot) {
    var childSnap = childSnapshot.val();
    console.log(childSnap);
    console.log(childSnap.nameTrain, childSnap.destTrain, childSnap.timeTrain, childSnap.freqTrain);
    var newName = childSnap.nameTrain;
    var newDest = childSnap.destTrain;
    var newTime = childSnap.timeTrain;
    var newFreq = parseInt(childSnap.freqTrain);

    var newTimeConverted = moment(newTime, "HH:mm").subtract(1, "years");
    console.log(newTimeConverted);

    var now = moment();
    console.log("CURRENT TIME: " + moment(now, "HH:mm"));

    var diffTime = moment(now).diff(moment(newTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    var remainder = diffTime % newFreq;
    console.log(remainder);

    minutesAway = newFreq - remainder;
    console.log(minutesAway);

    nextArrival = moment(now).add(minutesAway, "minutes");
    console.log(nextArrival);

    $("#table").append(  // > tbody
        $("<tr>").append(
            $("<td>").text(newName),
            $("<td>").text(newDest),
            $("<td>").text(newFreq),
            $("<td>").text(moment(nextArrival).format("hh:mm")),
            $("<td>").text(minutesAway)
        )
    );
});