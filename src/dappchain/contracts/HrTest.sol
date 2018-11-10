pragma solidity ^0.4.23;


import "./Playing.sol";

/**
* @title HrTest
* @dev Allows anyone view quiz history
* @author Brian Dhang
*/
contract HrTest is Playing {

    /**
    * Get Quiz Length
    * @dev Allows anyone get number of all quizs
    */
    function getQuizLength() public view returns(uint) {
        return quizs.length;
    }

    /**
    * Get Quiz QuestionIds
    * @dev Allow anyone get list questionIds in room
    * @param _quizId uint PIN of room
    */
    function getQuizQuestionIds(uint _quizId) public view returns(uint[]) {
        return quizIdToQuestionIds[_quizId];
    }


    /**
    * Get OptionIds
    * @dev Allow anyone get list optionIds of current question
    * @param _questionId uint Id of question
    */
    function getOptionIds(uint _questionId) public view returns(uint[]){
        return questionIdToOptionIds[_questionId];
    }
}