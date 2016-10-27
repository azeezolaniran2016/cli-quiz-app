//Questions Object
var quiz = function (subject, questions) {
  //properties
  this.questions = questions ;
  this.duration = this.questions.time ;
  this.subject = subject ;
  this.questionNumber = 0 ;
  this.currentAnswer ;

  //methods
  //Function to show user the next question
  this.nextQuestion = function nextQuestion(readline){
    ++this.questionNumber ; // increment question number
    var question = this.fetchQuestion(questions, this.questionNumber);
    this.currentAnswer = question.answer ;
    console.log("\n  [ Question " + this.questionNumber  + " ]"); //Header for each question
    console.log("\t" + question.title); //Show question
    console.log("\t" + "(A) " + question.A); //Show option A
    console.log("\t" + "(B) " + question.B); //Show option B
    console.log("\t" + "(C) " + question.C); //Show option C
    console.log("\t" + "(D) " + question.D); //Show option D
    readline.setPrompt("  Answer >> ");
    readline.prompt();
  }

  //function to fectch specific question from a subject three
  this.fetchQuestion = function (questions, child){
    switch(child){
      case 1:{
        return questions.question1 ;
        break ;
      }
      case 2:{
        return questions.question2 ;
        break ;
      }
      case 3:{
        return questions.question3 ;
        break ;
      }
      case 4:{
        return questions.question4 ;
        break ;
      }
      case 5:{
        return questions.question5 ;
        break ;
      }
      case 6:{
        return questions.question6 ;
        break ;
      }
      case 7:{
        return questions.question7 ;
        break ;
      }
      case 8:{
        return questions.question8 ;
        break ;
      }
      case 9:{
        return questions.question9 ;
        break ;
      }
      case 10:{
        return questions.question10 ;
        break ;
      }
      default:{
        return questions.question1 ;
      }
    }
  }
};

module.exports =  quiz ;