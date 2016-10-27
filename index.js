const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout, terminal: false
});

const localQuizzesPath = "./quizzes/"; //Path to local quizzes folder
const fileSystem = require("fs");
const firebase = require("firebase");

const firebaseConfig = { //Declare firebase configuration file
  apiKey: "AIzaSyAO_eNpYlQ4poDQbKWuCuWz4uWGcqmBscg",
  authDomain: "cli-quiz-app.firebaseapp.com",
  databaseURL: "https://cli-quiz-app.firebaseio.com",
  storageBucket: "cli-quiz-app.appspot.com",
  messagingSenderId: "236696717593"
};

firebase.initializeApp(firebaseConfig); //Initialize firebase with configuration

var quizOn = false ; //Quiz mode is turn on
var jsonQuiz ; //Pointer to current json quiz object
var currentQuestionIndex; //Pointer for current question index
var currentAnswer ; //Pointer to current question answer
var currentScore ; //Pointer to current quiz score
var currentQuizName ; //variable to hold current quiz name
var userFirstName ;//
var userLastName ;

readline.setPrompt(">> ")
console.log("\n******************** Andela CLI Quiz App ********************");
showWelcomeCommands();

//function to display commands to console
function showWelcomeCommands(){
  console.log("\n\tAvailable Commands");
  console.log('  "listquizzes" - Lists out all quizzes available locally');
  console.log('  "importquiz [path to source] [output file name] " - Import a quiz file from a directory in your host machine');
  console.log('  "takequiz [quizname] - Begin taking a quiz from the list of available quizzes"');
  console.log('  "listonlinequizzes" - Lists Quizzes that are available online');
  console.log('  "downloadonlinequiz [quizname]" - Downloads specified quiz from firebase quiz repository to your local library');
  console.log('  "uploadquiz [quizname]" - Uploads specified Quiz to firebase quiz repository');
  console.log('  "setusername [first name] [last name]" - Set user first and last name');
  //set prompt character
  readline.prompt() ; //prompt user for input
}

function listOnlineQuizzes(){
  readline.pause();
  console.log("     Fetching Online Quizzes. Please wait....");
  var query = firebase.database().ref("Subjects");
  query.once("value").then(function(snapshot){
      var count = 1 ; ;
      snapshot.forEach(function(childSnapshot){
        console.log("\t" + count + " - " + childSnapshot.key);
        ++count ;
      });
      readline.resume();
      readline.prompt();
    });
}

function uploadQuizToFirebaseRepository(quizName){
  //check if the quiz doesn't exist on the repo
  readline.pause();
  console.log("Starting Quiz upload");
  var jsonObject = getQuizJsonObjectFromLocalFile(quizName);
  //var jsonString = JSON.stringify(jsonObject);
  //console.log(jsonString);
  //console.log(jsonObject);
  var ref = firebase.database().ref("Subjects/");
  ref.child(quizName).set(jsonObject);
  console.log("Quizz uploaded");
  readline.resume();
  readline.prompt();
}

function downloadOnlineQuiz(quizName){
  readline.pause();
  //Check if the quiz exists first
  if (fileSystem.existsSync(localQuizzesPath + quizName + ".json")){
    console.log("File Already Exists and would be overwritten");
  }
  var query = firebase.database().ref("Subjects/" + quizName);
  query.on("value", function(snapshot){
    var jsonString = JSON.stringify(snapshot.val());
    saved = fileSystem.writeFileSync(localQuizzesPath + quizName + ".json", jsonString, 'utf8');
    console.log("File Download successfull");
    readline.resume();
    readline.prompt();
  }, function(errorObject){
    console.log("Failed to download quiz. Try again later");
    readline.resume();
  }) ;
  //If it exists, proceed.. else tell user it doesn't exist
}

function listLocalQuizzes(){
  readline.pause();
  var availableLocalQuizzes = fileSystem.readdirSync(localQuizzesPath); //Do a synchronous read of all files in the directory
  var totalQuizzes = availableLocalQuizzes.length; //Get lenght of files in the directory
  if( totalQuizzes > 0){ //If there are more than one quiz file, list them out
    console.log("There are " + totalQuizzes + " quizzes locally available;");
    for(var currentIndex = 0; currentIndex < totalQuizzes; currentIndex++){
      console.log("\t" + (currentIndex + 1 ) + " - " + availableLocalQuizzes[currentIndex].replace(".json", ""));
    }
  }else{//There are no quiz file
    console.log("There are no locally available quizzes");
  }
  readline.resume();
  readline.prompt();
}

//Function to get a quizz json object from a specified file in the quizz directory
function getQuizJsonObjectFromLocalFile(fileName){
  var content = fileSystem.readFileSync(localQuizzesPath + fileName + ".json");
  var jsonContent = JSON.parse(content);
  return jsonContent ;
}

function serveNextJsonQuestion(){
  ++currentQuestionIndex ;
  switch(currentQuestionIndex){
    case 1 :{
      currentAnswer = jsonQuiz.question1.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question1.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question1.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question1.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question1.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question1.D); //Show option D
      break ;
    }
    case 2:{
      currentAnswer = jsonQuiz.question2.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question2.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question2.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question2.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question2.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question2.D); //Show option D
      break ;
    }
    case 3:{
      currentAnswer = jsonQuiz.question3.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question3.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question3.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question3.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question3.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question3.D); //Show option D
      break ;
    }
    case 4:{
      currentAnswer = jsonQuiz.question4.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question4.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question4.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question4.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question4.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question4.D); //Show option D
      break ;
    }
    case 5:{
      currentAnswer = jsonQuiz.question5.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question5.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question5.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question5.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question5.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question5.D); //Show option D
      break ;
    }
    case 6:{
      currentAnswer = jsonQuiz.question6.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question6.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question6.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question6.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question6.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question6.D); //Show option D
      break ;
    }
    case 7:{
      currentAnswer = jsonQuiz.question7.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question7.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question7.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question7.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question7.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question7.D); //Show option D
      break ;
    }
    case 8:{
      currentAnswer = jsonQuiz.question8.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question8.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question8.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question8.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question8.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question8.D); //Show option D
      break ;
    }
    case 9:{
      currentAnswer = jsonQuiz.question9.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question9.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question9.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question9.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question9.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question9.D); //Show option D
      break;
    }
    case 10:{
      currentAnswer = jsonQuiz.question10.answer ;
      console.log("\n  [ Question " + currentQuestionIndex  + " ]"); //Header for each question
      console.log("\t" + jsonQuiz.question10.title); //Show question
      console.log("\t" + "(A) " + jsonQuiz.question10.A); //Show option A
      console.log("\t" + "(B) " + jsonQuiz.question10.B); //Show option B
      console.log("\t" + "(C) " + jsonQuiz.question10.C); //Show option C
      console.log("\t" + "(D) " + jsonQuiz.question10.D); //Show option D
      break ;
    }
  }
  readline.prompt();
/*
  console.log("\n  [ Question " + (currentQuestionIndex + 1) + " ]"); //Header for each question
  console.log("\t" + jsonQuiz.questions[currentQuestionIndex].title); //Show question
  currentAnswer = jsonQuiz.questions[currentQuestionIndex].solution;  //Update current question solution pointer
  console.log("\t" + "(A) " + jsonQuiz.questions[currentQuestionIndex].options[0].opt ); //Show option A
  console.log("\t" + "(B) " + jsonQuiz.questions[currentQuestionIndex].options[1].opt); //Show option B
  console.log("\t" + "(C) " + jsonQuiz.questions[currentQuestionIndex].options[2].opt); //Show option C
  console.log("\t" + "(D) " + jsonQuiz.questions[currentQuestionIndex].options[3].opt); //Show option D
  ++currentQuestionIndex ; //Increment current question index to point to next question
  readline.prompt(); //Prompt User for Input
*/
}

//fuction to Import a quiz file
function importLocalQuizFile(sourcePath, outputName){
  if(fileSystem.existsSync(sourcePath)){// check source path
    if(fileSystem.existsSync(localQuizzesPath + outputName + ".json")){//Check, we don't want to override an already existing quiz
        console.log("Quiz file already exists locally.")
    }else{//Quiz doesn't already exist. copy it
      console.log("Copying file...") ;
      fileSystem.createReadStream(sourcePath).pipe(fileSystem.createWriteStream(localQuizzesPath + outputName + ".json"));
      console.log("Finished copying file") ;
    }
  }else{
    console.log(" Source File Doesn't exist");
  }
  readline.prompt();
}

//Function to add on user input command
function actOnCommand(commandList){
  //switch based on first argument
  var command = commandList[0];
  var argument1 = commandList[1];
  var argument2 = commandList[2];
  switch(command){
    case "listquizzes":{
      listLocalQuizzes();
      break ;
    }
    case "setusername":{
      userFirstName = (typeof argument1 === undefined ? "" : argument1) ;
      userLastName = (typeof argument2 === undefined ? "" : argument2) ;
      break ;
    }
    case "listonlinequizzes":{
      listOnlineQuizzes();
      break ;
    }
    case "importquiz":{
      importLocalQuizFile(argument1.trim().replace("\\","/"), argument2.trim());
      break ;
    }
    case "downloadonlinequiz":{
      downloadOnlineQuiz(argument1.trim());
      break ;
    }
    case "uploadquiz":{
      uploadQuizToFirebaseRepository(argument1.trim());
      break ;
    }
    case "takequiz":{
      quizOn = true ;
      readline.setPrompt("Answer >> "); //Set prompt character
      console.log("Fetching " + argument1.trim() + " Quiz");
      currentQuizName = argument1.trim() ;
      jsonQuiz = getQuizJsonObjectFromLocalFile(argument1.trim()); //set .jsonQuiz
      console.log("\n Quiz Session Started. \t Maximum Duration : " + jsonQuiz.time + " Mins");
      currentQuestionIndex = 0 ; //reset current question
      currentScore = 0 ; //reset user score
      serveNextJsonQuestion() ; //serve next question to user
      break
    }
    default:{
      console.log(command + " is not a recognized command.");
      showWelcomeCommands();
      readline.prompt();
    }
  }
}

readline.on("line", function(line){
  //we are having a quiz right now
  var answer = line.trim();
  answer = answer.toUpperCase();
  if(quizOn){
    switch(answer) {
      case "A":
      case "B":
      case "C":
      case "D":{
        if(currentQuestionIndex >= 10){
          quizOn = false ; //turn off quiz mode
          console.log("\n End of " + currentQuizName.toUpperCase() + " Quiz Session ");
          console.log("\t" + userFirstName + " " + userLastName + " - Your Score : " + currentScore + " / 10" );
          readline.setPrompt(">>"); //Set prompt
          showWelcomeCommands();  //Show user welcome commands
          //end of quiz reached
        }else{
          if(answer === currentAnswer){
            ++currentScore ; //update user score
          }
          serveNextJsonQuestion();//serve next question when ready
        }
        break ;
      }
      case "Q":{
        readline.setPrompt(">> ")
        console.log("Quizz Ended by User");
        quizOn = false ;
        showWelcomeCommands();
        break ;
      }
      default:{
        console.log("That command is unkown");
        console.log("Respond with option A, B, C, or D to the question. Enter Q to end quiz session.");
        readline.prompt();
      }
    }
  }else{
    input = line.split(" "); //Split user input to get command and argument.
    if(input.length < 1){
      console.log("Invalid command entered. Try again with appropriate command");
      showWelcomeCommands();
    }else{
      actOnCommand(input);
    }
  }
});
