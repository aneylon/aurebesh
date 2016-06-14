var examples = [];
var vocab = [];
var infoText = [];
var theLetter = "";
var theWord = "";
var timerInterval = 250;	// time to show blank space // 1000 = 1sec
var words = [];
var currentWord = 0;
var currentLetter = 0;

window.onload = function (){
	// get example sentences and update to DOM
	LoadDoc("sentences.json",function(data){
		examples = data;
		// sort example sentences by length to mimic SW opening crawl
		examples.sort(function(a, b){
  			return a.length - b.length;
		});
		// update dom with info
		WriteExampleSentences(examples);
	});
	
	// load the info text and update the DOM
	LoadDoc("info.json",function(data){
		infoText = data;
		Log(infoText);
		WriteInfoText(infoText);
	});
		
	document.getElementById("startButton").onclick = function() {
		// show the 'quiz' pane
		SetElementDisplayType("quizPane","block");
		// hide the 'info' pane if visible
		SetElementDisplayType("infoPane","none");
		// get vocab data and begin 'flash carding'
		LoadDoc("vocab.json",function(data){
			vocab = data;
			Start();
		});
	};
	
	document.getElementById("closeQuiz").onclick = function(){
		// close the quiz pane and reset all variable values
		SetElementDisplayType("quizPane","none");
		ResetQuiz();
	};
	
	document.getElementById("nextButton").onclick = function(){
		// display the next item
		UpdateCurrentCharacter();
	};
	
	document.getElementById("infoButton").onclick = function() {
		// show the info pane and hide the quiz pane if visible
		SetElementDisplayType("infoPane","block");
		SetElementDisplayType("quizPane","none");
		ResetQuiz();
	};
	
	document.getElementById("closeInfo").onclick = function(){
		// close the info pane
		SetElementDisplayType("infoPane","none");
	};
};

function WriteInfoText (arr){
	// iterate through each line of text, add to string with tags and update dom.
	var output = "";
	ForEach(arr,function(item){
		output += "<p>";
		output += item;
		output += "</p>\n<br>\n";
	});
	ChangeHTML("infoText",output);
}

function SetElementDisplayType(id,display){
	// change element of specified id to specified display value
	document.getElementById(id).style.display = display;
}

function ResetQuiz(){
	// reset quiz for next time.
	currentWord = 0;
	currentLetter = 0;
}

function WriteExampleSentences (examples){
	// iterate through sample sentences and append to string with tage, then update DOM.
	var output = "";
	ForEach(examples,function(line){
		output += "<p>";
		output += line;
		output += "</p>\n";
	});
	ChangeHTML("examples",output);
}

function ForEach(collection, action){
	// iterate through items in collections with less typeing.
	if(Array.isArray(collection)){
		for ( var i = 0; i < collection.length; i++ ){
			action(collection[i]);
		}
	} else {
		for ( var item in collection ) {
			action(collection[item]);
		}
	}
}

function Log(x){
	// for testing with less typeing
	console.log(x);
}

function ChangeHTML(id,val){
	// change the innerHTML value of the specified id to the specified value.
	document.getElementById(id).innerHTML = val;
}

function NumberOfSentences (){
	// return the number of entries in the words variable.
	return words.length;
}

function Start (){
	// load the vocab data and randomize
	Load(vocab);
}

function Load (array){
	words = array;
	Randomize();
}

function Randomize (){
	// iterate through each item and randomly switch with another.
	ForEach(words,function(word){
		var tmp = word;
		var rand = Math.floor((Math.random() * NumberOfSentences()));
		word = words[rand];
		words[rand] = tmp;
	});
	// begin showing items character by character
	ShowCharacter();
}

function UpdateWordSelection (){
	// move to next example
	if (currentWord < NumberOfSentences() - 1){
		currentWord++;
	} else {
		// if no more then reset and randomize
		currentWord = 0;
		Randomize();
	}
}

function UpdateCurrentCharacter (){
	// move to next character.
	if ( currentLetter < words[currentWord].length - 1){
		currentLetter++;
		// if character is space, skip to next
		if(words[currentWord].charAt(currentLetter) == " "){
			UpdateCurrentCharacter();
		} else {
			// show the current character
			ShowCharacter();	
		}
	} else {
		// reset current character and show the entire word
		currentLetter = -1;
		ShowWord();
		UpdateWordSelection();
	}	
}

function ShowWord (){
	// update to current word and display
	theWord = words[currentWord];
	UpdateText(theWord);
}

function ShowCharacter (){
	// update to current character and display
	theLetter = words[currentWord].charAt(currentLetter);
	UpdateText(theLetter);
}

function UpdateText(text){
	// clear current displayed character
	ChangeHTML("quizExample","&nbsp;");
	ChangeHTML("quizClue","&nbsp;");
	// wait before changeing
	setTimeout(function(){
		// set new character for display
		ChangeHTML("quizExample",text);
		ChangeHTML("quizClue",text);
	}, timerInterval);
}

function LoadDoc(fileName,action) {
	// load json doc with AJAX, use action callback to assign data to var for use.
	var xhttp = new XMLHttpRequest();
	var data = [];
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			data = JSON.parse(xhttp.responseText);
			action(data);
		}
	};
	xhttp.open("GET", fileName, true);
	xhttp.send();
}

// used this to take a giant list of qoutes and put them in order to verify there were no doubles or app.
function OrderSentences (text){
	text.sort(function(a, b){
  		return a.length - b.length;
	});
	var output = "";
	ForEach(text,function(line){
		output += "<p>";
		output += line;
		output += "</p>\n";
	});
	ChangeHTML("lines",output);
}

/*
	// later expansion
	user types answer
	multiple choice quiz
	use Angular?
*/