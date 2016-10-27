/*const requireReadLine = require("readline");
const readline = requireReadLine.createInterface({
  input: process.stdin , output: process.stdout
});
*/
//User Object
var User = function (firstName, lastName) {
  this.firstName = firstName ; //user first name
  this.lastName = lastName;  //user last name
  this.currentScore = 0 ; //current score of the user

  //methods
  this.requestFirstName = function (readline){
        console.log("\nPlease enter a FIRST NAME to continue");
        readline.setPrompt(" First Name >> ");
        readline.prompt();
    }
};



module.exports =  User ;


