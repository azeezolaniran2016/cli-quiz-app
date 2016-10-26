const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout, terminal: false
});

const localQuizzesPath = "./quizzes";
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

function listLocalQuizzes(){
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
  readline.prompt();
}

//Function to get a quizz json object from a specified file in the quizz directory
function getQuizJsonObjectFromLocalFile(fileName){
  var content = fileSystem.readFileSync(localQuizzesPath + "/" + fileName + ".json");
  console.log("Fetching " + fileName + " Quiz");
  var jsonContent = JSON.parse(content);
  return jsonContent ;
}

function serveNextJsonQuestion(){
  console.log("\n  [ Question " + (currentQuestionIndex + 1) + " ]"); //Header for each question
  console.log("\t" + jsonQuiz.questions[currentQuestionIndex].title); //Show question
  currentAnswer = jsonQuiz.questions[currentQuestionIndex].solution;  //Update current question solution pointer
  console.log("\t" + "(A) " + jsonQuiz.questions[currentQuestionIndex].options[0].opt ); //Show option A
  console.log("\t" + "(B) " + jsonQuiz.questions[currentQuestionIndex].options[1].opt); //Show option B
  console.log("\t" + "(C) " + jsonQuiz.questions[currentQuestionIndex].options[2].opt); //Show option C
  console.log("\t" + "(D) " + jsonQuiz.questions[currentQuestionIndex].options[3].opt); //Show option D
  ++currentQuestionIndex ; //Increment current question index to point to next question
  readline.prompt(); //Prompt User for Input
}

//fuction to Import a quiz file
function importLocalQuizFile(sourcePath, outputName){
  if(fileSystem.existsSync(sourcePath)){// check source path
    if(fileSystem.existsSync(localQuizzesPath + "/" + outputName + ".json")){//Check, we don't want to override an already existing quiz
        console.log("Quiz file already exists locally.")
    }else{//Quiz doesn't already exist. copy it
      console.log("Copying file...") ;
      fileSystem.createReadStream(sourcePath).pipe(fileSystem.createWriteStream(localQuizzesPath + "/" + outputName + ".json"));
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
    case "listonlinequizzes":{
      listOnlineQuizzes();
      break ;
    }
    case "importquiz":{
      importLocalQuizFile(argument1.trim().replace("\\","/"), argument2.trim());
      break ;
    }

    case "takequiz":{
      quizOn = true ;
      readline.setPrompt("Answer >> "); //Set prompt character
      jsonQuiz = getQuizJsonObjectFromLocalFile(argument1); //set .jsonQuiz
      currentQuestionIndex = 0 ; //reset current question
      currentScore = 0 ; //reset user score
      serveNextJsonQuestion() ; //serve next question to user
      break ;
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
  if(quizOn){
    switch(answer) {
      case "A":
      case "B":
      case "C":
      case "D":{
        if(currentQuestionIndex >= jsonQuiz.questions.length){
          quizOn = false ; //turn off quiz mode
          console.log("\n End of Quizzes");
          console.log("\tYour Score : " + currentScore + " / " + jsonQuiz.questions.length);
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
