# **CLI Quiz Application**

## Introduction
**CLI Quiz Application** is an interactive command line based app. It presents the user with quizzes on various subjects and returns the user performance after a quiz session.
* It has the following features;
    * User can view list of quizzes available in the online library or local            library.
    * User can import a quiz file into the local quiz library.
    * User can download a specific quiz from the online quiz library into the           local quiz library
    * User can publish a local quiz file into the online library.
    * User can take a specific quiz and the user gets a score based on the answers      he got right
    * At the commencement of a quiz session, the user is shown the expected time for which he is expected to complete the quiz.

## Dependencies
 - [Node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.
 - [Firebase database Node.js module](firebase.google.com/docs/database/web/start) - The Firebase Realtime Database is a cloud-hosted database. Data is stored as JSON and synchronized in realtime to every connected client

### Installation and setup
1. Navigate to the directory of your choice using your favorite terminal
2. Ensure you have node properly installed on your machine. Check your version of node by entering the command ;
    > node -v
3. Clone **CLI Quiz App** repository on that directory;
    - Using SSH enter the command :
         > git clone git@github.com:azeezolaniran2016/cli-quiz-app.git

    - Using HTTP enter the command :
        > git clone https://github.com/azeezolaniran2016/cli-quiz-app.git
4. Navigate into the cloned repository
5. Install the **CLI Quiz App** dependencies using the command :
    > npm install
6. Launch the app using the command :
    > node index.js

That's it, you should have **CLI Quiz App** up and running. You can interact with the app by entering necessary commands/inputs.

### Todos

 - Write Tests
 - Make Command Line outputs coloured

License

**MIT**




