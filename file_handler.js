//Module to handle file related functionality
const fileSystem = require("fs");
const localQuizzesPath = "./quizzes/"; //Path to local quizzes folder

var file_handler = function(){
  //Method to Import a quiz file
  this.importLocalQuizFile = function (sourcePath, outputName, readline){
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

  //Method to list local quizzes
  this.listLocalQuizzes = function (readline){
    readline.pause();
    var availableLocalQuizzes = fileSystem.readdirSync(localQuizzesPath); //Do a synchronous read of all files in the directory
    var totalQuizzes = availableLocalQuizzes.length; //Get lenght of files in the directory
    if( totalQuizzes > 0){ //If there are more than one quiz file, list them out
      console.log("There are " + totalQuizzes + " quizzes locally available;");
      for(var currentIndex = 0; currentIndex < totalQuizzes; currentIndex++){
        console.log("\t" + (currentIndex + 1 ) + " - " + availableLocalQuizzes[currentIndex].replace(".json", ""));
      }
    }else{//There are no quiz file
      console.log("There are no  quizzes in the local library");
    }
    readline.resume();
    readline.prompt();
  }

  //Method to fetch a json quiz from a local library
  this.fetchQuiz = function (fileName){
    var content = fileSystem.readFileSync(localQuizzesPath + fileName + ".json");
    var jsonContent = JSON.parse(content);
    return jsonContent ;
  }
}

module.exports = file_handler ;