

// Initialize Firebase 
var config = {
  apiKey: "AIzaSyC2u3bzH5xW3XpJ1Y0-SR4DbciUjr3DLNA",
  authDomain: "train-scheduler-53c53.firebaseapp.com",
  databaseURL: "https://train-scheduler-53c53.firebaseio.com",
  storageBucket: "train-scheduler-53c53.appspot.com",
  messagingSenderId: "705870662535"
};

firebase.initializeApp(config);

var database = firebase.database();

//Train Add Button function
$("#addButton").on("click", function(event) {
	event.preventDefault();

	//train input declarations
	var trainName = $('#addTrainName').val().trim();
	var trainDest = $('#addDestination').val().trim();
	var trainFirst = $('#addFirstTrain').val().trim();
	var trainFirstUnix = parseInt(moment($('#addFirstTrain').val().trim(),"HH:mm").format('X'));
	var trainFreq = $('#addFrequency').val().trim();

	//Train object with inputs
	var newTrain = {
		name: trainName,
		dest: trainDest,
		first: trainFirst,
		firstunix: trainFirstUnix,
		freq: trainFreq
	};

	//Train object push to database
	database.ref().push(newTrain);

	//clear input fields upon submission
	$("#addTrainName").val(" ");
  	$("#addDestination").val(" ");
  	$("#addFirstTrain").val(" ");
  	$("#addFrequency").val(" ");

  	return false;
});

//Function when data is pushed to database
database.ref().on("child_added" , function(childSnapshot) {
	//Shorthand convenience
	var snap = childSnapshot.val();


	var trainName = snap.name;
	var trainDest = snap.dest;
	var trainFirst = snap.first;
	var trainFirstUnix = parseInt(snap.firstunix);
	var trainFreq = snap.freq;
	
	//first train conversion to total minutes
	trainFirstNum = snap.first.replace(':','').split("")
	trainFirstHours = parseInt(trainFirstNum[0] + trainFirstNum[1]);
	trainFirstMins = parseInt(trainFirstNum[2] + trainFirstNum[3])

	//conversion to unix
	var currentTimeUnix = parseInt(moment().format('X'));
	currentTime = unixConv(currentTimeUnix);
	
//----------------------------------------------------------------
//In minutes, total of first train time & current time from 00:00
	var trainFirstTotal = ((trainFirstHours * 60) + trainFirstMins);

	//current time conversion to total minutes
	
	currentHours = parseInt(moment().format('HH'));
	currentMins = parseInt(moment().format('mm'));

	var currentTimeTotal = ((currentHours * 60) + currentMins);

//----------------------------------------------------------------

	//get difference 
	var diff = currentTimeTotal - trainFirstTotal // mins
	var diffUnix = (currentTimeUnix - trainFirstUnix); // unix seconds
	
	// The nth train that has already arrived
	var x = Math.floor(diff / trainFreq);
	var y = (trainFreq * x) 

	//next train in mins from first train
	var z = (trainFreq * (x + 1))
//----------------------------------------------------------------

	//next train arrival in seconds from first train departure
	var nextTrainUnix = ((z * 60) + trainFirstUnix);
	
	var yy = (nextTrainUnix - currentTimeUnix)
	var trainArrival = unixConv(nextTrainUnix);

	//mins until next train arrival from current time, rounded up
	var minsAway = Math.ceil((nextTrainUnix - currentTimeUnix) / 60);
	
  // Add train's data into the table
  $(".train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainFreq + "</td><td>" + trainArrival + "</td><td>" + minsAway + "</td><tr>");

	//convert unix to HH:mm
	function unixConv(x) {
		var x = moment.unix(x).format("HH:mm");
		return x;
	}

});



