//Module to handle online functionality

const fileSystem = require("fs");
const firebase = require("firebase");
const localQuizzesPath = "./quizzes/"; //Path to local quizzes folder

const firebaseConfig = { //Declare firebase configuration file
  apiKey: "AIzaSyAO_eNpYlQ4poDQbKWuCuWz4uWGcqmBscg",
  authDomain: "cli-quiz-app.firebaseapp.com",
  databaseURL: "https://cli-quiz-app.firebaseio.com",
  storageBucket: "cli-quiz-app.appspot.com",
  messagingSenderId: "236696717593"
};

firebase.initializeApp(firebaseConfig); //Initialize firebase with configuration

var onlinedb_handler = function(){

  //Method to list online quizzes
  this.listOnlineQuizzes = function (readline){
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

  //Method to upload a local quiz online
  this.uploadQuiz = function (quiz, quizName, readline){
    readline.pause();
    console.log("Starting Quiz upload");
    var jsonObject = quiz ; //importLocalQuiz(quizName);
    var ref = firebase.database().ref("Subjects/");
    ref.child(quizName).set(jsonObject);
    console.log("Quizz uploaded");
    readline.resume();
    readline.prompt();
  }

  //Method to download an online quiz into the local library
  this.downloadOnlineQuiz = function (quizName, readline){
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
}

module.exports = onlinedb_handler ;

