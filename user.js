//User Object
var User = function (firstName, lastName) {
  this.firstName = firstName === undefined ? "": firstName ; //user first name
  this.lastName = lastName === undefined ? "" : lastName;  //user last name
  this.currentScore = 0 ; //current score of the user

  //methods
  this.requestFirstName = function (readline){ //User object asks for a name
        console.log("\nPlease enter a FIRST NAME to continue");
        readline.setPrompt(" First Name >> ");
        readline.prompt();
    }
};

module.exports =  User ;


