pragma solidity ^0.4.23;


import "./Template.sol";

/**
* @title Board
* @dev Allows host people control room
* @author Brian Dhang
*/
contract Board is Template {

    mapping(uint => bool) questionIdToSubmitedAll;
    mapping(uint => mapping(address => uint)) quizIdToUserScore;
    mapping(uint => address[]) quizIdToUsersList;
    mapping(uint => mapping(address => uint)) quizIdToUserReward;
    mapping(uint => mapping(address => bool)) questionIdToUserSubmited;


    event NextQuestion(uint indexed quizId, uint currentQuestion);
    event QuizComplete(uint indexed quizId);
    event GetReward(uint indexed quizId, address user, uint reward);

    /**
    * Next Question
    * @dev Host people next question
    * @param _quizId uint PIN of room
    */
    function nextQuestion(uint _quizId) public {
        require(quizIdToOwner[_quizId] == msg.sender, "Don't have permission.");
        require(quizIdToUsersList[_quizId].length > 0, "Don't have any player.");

        if (quizs[_quizId].currentQuestion < quizIdToQuestionIds[_quizId].length) {
            
            // Set startTime for currentQuestion
            uint _currentQuestion = quizs[_quizId].currentQuestion;
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion];
            questions[_currentQuestionId].timeStart = now;

            // Check valid time of previous question
            if(_currentQuestion > 0) {
                uint _previousQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
                bool enoughTime = questions[_previousQuestionId].timeStart + questions[_previousQuestionId].timeLimit < now;
                require(enoughTime || questionIdToSubmitedAll[_previousQuestionId], "Question not done!");
            }

            // Next question
            quizs[_quizId].currentQuestion++;
            emit NextQuestion(_quizId, quizs[_quizId].currentQuestion);
        } else {
            quizs[_quizId].completed = true;
            emit QuizComplete(_quizId); // Last answer and show result
            
            // Give reward if user got highScore
            address winner;
            uint highScore;
            for (uint i = 0; i < quizIdToUsersList[_quizId].length; i++)  {
                address _user = quizIdToUsersList[_quizId][i];
                if(quizIdToUserScore[_quizId][_user] > highScore) {
                    winner = _user;
                    highScore = quizIdToUserScore[_quizId][_user];
                }
            }
            uint _reward = quizs[_quizId].reward;
            teneCoinContract.earn(winner, _reward);
            quizIdToUserReward[_quizId][winner] = _reward;
            emit GetReward(_quizId, winner, _reward);
        }
    }

    /**
    * Get Quiz Users List 
    * @dev Allows anyone get list users in room
    * @param _quizId uint PIN of room
    */
    function getQuizUsersList(uint _quizId) public view returns (address[]) {
        return quizIdToUsersList[_quizId];
    }

    /**
    * Get Quiz User Score 
    * @dev Allows anyone get user score in room
    * @param _quizId uint PIN of room
    * @param _user address
    */
    function getQuizUserScore(uint _quizId, address _user) public view returns (uint) {
        return quizIdToUserScore[_quizId][_user];
    }

    /**
    * Get Quiz User Reward 
    * @dev Allows anyone get user reward in room
    * @param _quizId uint PIN of room
    * @param _user address
    */
    function getQuizUserReward(uint _quizId, address _user) public view returns (uint) {
        return quizIdToUserReward[_quizId][_user];
    }

    /**
    * Get Quiz User Reward 
    * @dev Allows anyone get user reward in room
    * @param _quizId uint PIN of room
    */
    function getCurrentQuestionId(uint _quizId) public view returns (uint) {
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        if(_currentQuestion > 0) {
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
            return _currentQuestionId;
        }
    }

    /**
    * Get Server Time
    * @dev Allows anyone get server time
    */
    function getServerTime() public view returns (uint) {
        return now;
    }

    /**
    * Check User Submited
    * @dev Allows anyone check user submited question
    * @param _questionId uint Id of question
    */
    function checkUserSubmited(uint _questionId) public view returns (bool) {
        return questionIdToUserSubmited[_questionId][msg.sender];
    }

    /**
    * Get Current OptionIds
    * @dev Allows anyone get current list optionIds in room
    * @param _quizId uint PIN of room
    */
    function getCurrentOptionIds(uint _quizId) public view returns (uint[]) {
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        if(_currentQuestion > 0) {
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
            return questionIdToOptionIds[_currentQuestionId];
        }
    }
}