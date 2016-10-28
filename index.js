const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout
});

const localQuizzesPath = "./quizzes/"; //Path to local quizzes folder
const user = new(require("./user"));//create a new user object
const quiz = require("./quiz");
const file_handler = new (require("./file_handler"));
const onlinedb_handler = new (require("./onlinedb_handler"));

const helpMessage = "\n\tAvailable Commands\n" + '  "listquizzes" - Lists out all quizzes available locally\n' +
    '  "importquiz [path to source] [output file name] " - Import a quiz file from a directory in your host machine\n' +
    '  "takequiz [quizname] - Begin taking a quiz from the list of available quizzes"\n' +
    '  "listonlinequizzes" - Lists Quizzes that are available online\n' +
    '  "downloadonlinequiz [quizname]" - Downloads specified quiz from firebase quiz repository to your local library\n' +
    '  "uploadquiz [quizname]" - Uploads specified Quiz to firebase quiz repository\n' +
    '  "setusername [Name]" - Set user first and last name\n'

var quizOn = false ; //Quiz mode is turn on
var currentQuiz ; //variable to hold current quiz Object
console.log("\nCLI  *************************************************");
console.log("******************* Quiz App *************************");
console.log("**********************************  By Azeez Olaniran.");
requestFirstName();

//function to ensure user enters his first name before proceeding
function requestFirstName(){
  readline.question("\nPLEASE ENTER A USER NAME TO CONTINUE \n User Name >> ", function(answer){
    if(answer.trim() === ""){
      requestFirstName();
    }else{
      user.firstName = answer ;
      console.log(helpMessage)
      readline.setPrompt(">> ");
      readline.prompt();
    }
  });
}

//function to display commands to console
function showWelcomeCommands(){
  console.log(helpMessage);
  readline.setPrompt(">> ");//set prompt character
  readline.prompt() ; //prompt user for input
}

function startQuiz(quizName){
  quizOn = true ;
  readline.setPrompt("Answer >> "); //Set prompt character
  console.log("Fetching " + quizName.toUpperCase() + " Quiz");
  currentQuiz = new quiz(quizName.toUpperCase(), file_handler.fetchQuiz(quizName));
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
      file_handler.listLocalQuizzes(readline);
      break ;
    }
    case "setusername":{
      user.firstName = option1.trim() ;
      readline.prompt();
      break ;
    }
    case "listonlinequizzes":{
      onlinedb_handler.listOnlineQuizzes(readline);
      break ;
    }
    case "importquiz":{
      file_handler.importLocalQuizFile(option1.trim().replace("\\","/"), option2.trim(), readline);
      break ;
    }
    case "downloadonlinequiz":{
      onlinedb_handler.downloadOnlineQuiz(option1.trim(), readline);
      break ;
    }
    case "uploadquiz":{
      onlinedb_handler.uploadQuiz(file_handler.fetchQuiz(option1.trim()), option1.trim(), readline);
      break ;
    }
    case "takequiz":{
      startQuiz(option1.trim());
      break
    }
    default:{
      console.log(input + " - Unrecognized command.");
      showWelcomeCommands();
    }
  }
}

function printQuizResult(firstName, quizName, score){
  console.log("\tUser Name : " + firstName);
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
          printQuizResult(user.firstName, currentQuiz.subject, user.currentScore + " / " + currentQuiz.questionNumber);
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
        console.log("\n Results For " + currentQuiz.subject + " Quiz Session ");
        printQuizResult(user.firstName, currentQuiz.subject, user.currentScore + " / " + currentQuiz.questionNumber);
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
        quizOn = false ;
        console.log("Invalid Command. Try Again..");
        showWelcomeCommands();
      }
    }
  }
});
