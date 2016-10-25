const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout
});
console.log("Andela CLI Quiz App");
showWelcomeCommands();
//function to display commands to console
function showWelcomeCommands(){
  console.log("Available Command List");
  console.log('"listQuizzes" - Lists out all quizzes available locally');
  console.log('"importquiz" - Import a quiz file from a directory in your host machine');
  console.log('"takequiz <quiz name> - Begin taking a quiz from the list of available quizzes"');
}