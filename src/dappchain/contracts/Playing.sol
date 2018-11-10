pragma solidity ^0.4.23;

import "./Board.sol";

/**
* @title Playing
* @dev Allows player join room, submit answer
* @author Brian Dhang
*/
contract Playing is Board {

    mapping(uint => mapping(address => bool)) quizIdToUser;

    event JoinQuiz(uint indexed quizId, address user);
    event SubmitAnswer(uint indexed quizId, uint indexed questionId, uint score, uint totalScore);
    event SubmitedAll(uint indexed quizId, uint questionId);

    /**
    * Join Quiz
    * @dev Allow anyone join room if it not finished
    * @param _quizId uint PIN of room
    */
    function joinQuiz(uint _quizId) public {
        require(!quizs[_quizId].completed, "Room not available for join.");
        if(quizIdToUser[_quizId][msg.sender] != true) {
            quizIdToUser[_quizId][msg.sender] = true;
            quizIdToUsersList[_quizId].push(msg.sender);
        }
        emit JoinQuiz(_quizId, msg.sender);
    }

    /**
    * Join Quiz
    * @dev Allow player submit question
    * @param _quizId uint PIN of room
    * @param _questionId uint Id of question
    * @param _selectedOption uint Index of option in the list
    */
    function submitAnswer(uint _quizId, uint _questionId, uint _selectedOption) public {
        require(quizIdToUser[_quizId][msg.sender] == true, "User have not joined.");
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        require(_questionId == quizIdToQuestionIds[_quizId][_currentQuestion - 1], "Wrong question index.");
        require(questions[_questionId].timeStart + questions[_questionId].timeLimit >= now, "Time's Up");

        // Prevent re-answer
        require(!questionIdToUserSubmited[_questionId][msg.sender], "Already submited.");
        questionIdToUserSubmited[_questionId][msg.sender] = true;

        // Calculate score
        uint score = questionIdToOptionScore[_questionId][_selectedOption];
        quizIdToUserScore[_quizId][msg.sender] += score;
        
        // Show result
        emit SubmitAnswer(_quizId, _questionId, score, quizIdToUserScore[_quizId][msg.sender]);

        // Next question if everyone submited.
        bool submitedAll = true;
        for (uint i = 0; i < quizIdToUsersList[_quizId].length; i++)  {
            address _user = quizIdToUsersList[_quizId][i];
            if(!questionIdToUserSubmited[_questionId][_user]) {
                submitedAll = false;
            }
        }
        if(submitedAll) {
            questionIdToSubmitedAll[_questionId] = true;
            emit SubmitedAll(_quizId, _questionId);
        }
    }

}