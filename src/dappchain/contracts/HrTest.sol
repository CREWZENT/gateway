pragma solidity ^0.4.23;


import "./Playing.sol";

contract HrTest is Playing {

    function getQuizLength() public view returns(uint) {
        return quizs.length;
    }

    function getQuizQuestionIds(uint _quizId) public view returns(uint[]) {
        return quizIdToQuestionIds[_quizId];
    }

    function getOptionIds(uint _questionId) public view returns(uint[]){
        return questionIdToOptionIds[_questionId];
    }
}