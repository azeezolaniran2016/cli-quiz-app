const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout
});

const localQuizzesPath = "./quizzes/"; //Path to local quizzes folder
const fileSystem = require("fs");
const firebase = require("firebase");
const user = new(require("./user"));//create a new user object
const quiz = require("./quiz");

const firebaseConfig = { //Declare firebase configuration file
  apiKey: "AIzaSyAO_eNpYlQ4poDQbKWuCuWz4uWGcqmBscg",
  authDomain: "cli-quiz-app.firebaseapp.com",
  databaseURL: "https://cli-quiz-app.firebaseio.com",
  storageBucket: "cli-quiz-app.appspot.com",
  messagingSenderId: "236696717593"
};

firebase.initializeApp(firebaseConfig); //Initialize firebase with configuration

var quizOn = false ; //Quiz mode is turn on
var currentQuiz ; //variable to hold current quiz Object
console.log("\nCLI  *************************************************");
console.log("******************* Quiz App *************************");
console.log("**********************************  By Azeez Olaniran.");
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
  console.log('  "setusername [first name] [last name]" - Set user first and last name\n');
  readline.setPrompt(">> ");//set prompt character
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

function uploadQuiz(quizName){
  //check if the quiz doesn't exist on the repo
  readline.pause();
  console.log("Starting Quiz upload");
  var jsonObject = importLocalQuiz(quizName);
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
function importLocalQuiz(fileName){
  var content = fileSystem.readFileSync(localQuizzesPath + fileName + ".json");
  var jsonContent = JSON.parse(content);
  return jsonContent ;
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

function startQuiz(quizName){
  quizOn = true ;
  readline.setPrompt("Answer >> "); //Set prompt character
  console.log("Fetching " + quizName.toUpperCase() + " Quiz");
  currentQuiz = new quiz(quizName.toUpperCase(), importLocalQuiz(quizName));
  user.currentScore = 0 ; //reset user score
  console.log("\n Quiz Session Started. \t Maximum Duration : " + currentQuiz.duration + " Mins");
  currentQuiz.nextQuestion(readline);
}

//Function to add on user input command
function executeInputCommand(commands){
  //switch based on first argument
  var input = commands[0];
  var option1 = commands[1];
  var option2 = commands[2];
  switch(input){
    case "listquizzes":{
      listLocalQuizzes();
      break ;
    }
    case "setusername":{
      user.FirstName = option1.trim() ;
      user.LastName = option2.trim() ;
      readline.prompt();
      break ;
    }
    case "listonlinequizzes":{
      listOnlineQuizzes();
      break ;
    }
    case "importquiz":{
      importLocalQuizFile(option1.trim().replace("\\","/"), option2.trim());
      break ;
    }
    case "downloadonlinequiz":{
      downloadOnlineQuiz(option1.trim());
      break ;
    }
    case "uploadquiz":{
      uploadQuiz(option1.trim());
      break ;
    }
    case "takequiz":{
      startQuiz(option1.trim());
      break
    }
    default:{
      console.log(input + " is not a recognized command.");
      showWelcomeCommands();
    }
  }
}

function printQuizResult(firstName, lastName, quizName, score){
  console.log("\tFirst Name : " + firstName);
  console.log("\tLast Name : "  + lastName);
  console.log("\tQuiz : " + quizName);
  console.log("\tScore : " + score);
}

//function to read user inputs
readline.on("line", function(line){
  if(quizOn){
    //we are having a quiz right now
    var answer = line.trim();
    answer = answer.toUpperCase();
    switch(answer) {
      case "A":
      case "B":
      case "C":
      case "D":{
        if(currentQuiz.questionNumber >= 10){
          quizOn = false ; //turn off quiz mode
          console.log("\n Results For " + currentQuiz.subject + " Quiz Session ");
          printQuizResult(user.FirstName, user.LastName, currentQuiz.subject, user.currentScore + " / 10")
          readline.setPrompt(">> "); //Set prompt
          showWelcomeCommands();  //Show user welcome commands
          //end of quiz reached
        }else{
          if(answer === currentQuiz.currentAnswer){
            ++user.currentScore ; //update user score
          }
          currentQuiz.nextQuestion(readline);//serve next question when ready
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
    input = line.trim().split(" "); //Split user input to get command and argument.
    if(input.length < 1 || input.length > 3){
      console.log("Invalid command entered. Try again with appropriate command");
      showWelcomeCommands();
    }else{
      try{
        executeInputCommand(input);
      }catch(err){
        readline.prompt();
        console.log("Invalid Command. Try Again..");
        showWelcomeCommands();
      }
    }
  }
});
