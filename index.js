const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout
});

const localQuizzesPath = "./quizzes";
const fileSystem = require("fs");

console.log("Andela CLI Quiz App");
showWelcomeCommands();

//function to display commands to console
function showWelcomeCommands(){
  console.log("Available Command List");
  console.log('"listquizzes" - Lists out all quizzes available locally');
  console.log('"importquiz" - Import a quiz file from a directory in your host machine');
  console.log('"takequiz <quiz name> - Begin taking a quiz from the list of available quizzes"');
}

function listLocalQuizzes(){
  var availableLocalQuizzes = fileSystem.readdirSync(localQuizzesPath);
  if(availableLocalQuizzes.length > 0){
    for(var currentIndex = 0; currentIndex < availableLocalQuizzes.length; currentIndex++){
      console.log("There are " + (currentIndex + 1) + " quizzes available locally:");
      console.log("\t" + (currentIndex + 1 ) + " - " + availableLocalQuizzes[currentIndex].replace(".json", ""));
    }
  }else{
    console.log("There are no quizzes available locally");
  }
  readline.prompt();
}

//Function to add on user input command
function actOnCommand(commandList){
  //switch based on first argument
  var command = commandList[0];
  var option = commandList[1];
  switch(command){
    case "listquizzes":{
      listLocalQuizzes();
      break ;
    }

    case "importquiz":{
      break ;
    }

    case "takequiz":{
      break ;
    }
    default:{
      console.log(command + " is not a recognized command");
      showWelcomeCommands();
      readline.prompt();
    }
  }
}

//set prompt character
readline.setPrompt(">> ");
readline.prompt() ; //prompt user for input

readline.on("line", function(line){
  input = line.split(" "); //Split user input to get command and argument.
  if(input.length > 2){
    console.log("Invalid command entered. Try again with appropriate command");
    showWelcomeCommands();
    readline.prompt();
  }else{
    actOnCommand(input);
  }
});
