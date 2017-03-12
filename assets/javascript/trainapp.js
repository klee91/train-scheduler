

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

$("#addButton").on("click", function(event) {
	event.preventDefault();

	var trainName = $('#addTrainName').val().trim();
	var trainDest = $('#addDestination').val().trim();
	var trainFirst = $('#addFirstTrain').val().trim();
	var trainFirstUnix = parseInt(moment($('#addFirstTrain').val().trim(),"HH:mm").format('X'));
	var trainFreq = $('#addFrequency').val().trim();
	console.log(trainFirstUnix)

	var newTrain = {
		name: trainName,
		dest: trainDest,
		first: trainFirst,
		firstunix: trainFirstUnix,
		freq: trainFreq
	};

	console.log(newTrain.name);
	console.log(newTrain.dest);
	console.log(newTrain.first);
	console.log(newTrain.firstunix);
	console.log(newTrain.freq);

	database.ref().push(newTrain);

	$("#addTrainName").val(" ");
  	$("#addDestination").val(" ");
  	$("#addFirstTrain").val(" ");
  	$("#addFrequency").val(" ");

  	return false;
})


database.ref().on("child_added" , function(childSnapshot, prevChildKey) {
	var snap = childSnapshot.val();

	var trainName = snap.name;//Bay Express
	var trainDest = snap.dest;//NYC
	var trainFirst = snap.first;//12:00
	var trainFirstUnix = parseInt(snap.firstunix);//unix #
	var trainFreq = snap.freq;
	
	//first train conversion to total minutes
	trainFirstNum = snap.first.replace(':','').split("")
	trainFirstHours = parseInt(trainFirstNum[0] + trainFirstNum[1]);
	trainFirstMins = parseInt(trainFirstNum[2] + trainFirstNum[3])

	//conversion to unix
	var currentTimeUnix = parseInt(moment().format('X'));
	currentTime = unixConv(currentTimeUnix);
	console.log(currentTime)
	console.log(currentTimeUnix)
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
	var diffTime = moment.unix(diff).format('HH:mm'); // HH:mm
	console.log(diff)
	
	// The nth train that has already arrived
	var x = Math.floor(diff / trainFreq);//10th
	var y = (trainFreq * x) //mins of latest train from first train

	//next train in mins from first train
	var z = (trainFreq * (x + 1))
	console.log(z)
//----------------------------------------------------------------
//	

	//next train arrival in seconds from first train departure
	var nextTrainUnix = ((z * 60) + trainFirstUnix);
	console.log(nextTrainUnix)
	
	console.log(currentTimeUnix);
	//
	var yy = (nextTrainUnix - currentTimeUnix)
	var trainArrival = unixConv(nextTrainUnix);

	//number of minutes until next train arrival
	
	var minsAway = Math.ceil((nextTrainUnix - currentTimeUnix) / 60);
	
	// var minsAway = (diff % trainFreq);
  // Add train's data into the table
  $(".train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" +
  trainFreq + "</td><td>" + trainArrival + "</td><td>" + minsAway + "</td><tr>");

	//convert unix to HH:mm
	function unixConv(x) {
		var x = moment.unix(x).format("HH:mm");
		return x;
	}


});



