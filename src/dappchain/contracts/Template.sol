pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TeneCoin.sol";

/**
* @title Template
* @dev Allows anyone create room from existing template
* @author Brian Dhang
*/
contract Template is Ownable {

    TeneCoin teneCoinContract;
    uint modulus = 10**18;

    struct Quiz {
        string name;
        bool completed;
        uint currentQuestion;
        uint reward;
        address quizOwner;
    }
    struct Question {
        string questionText;
        uint timeLimit;
        uint timeStart;
    }
    struct Option {
        string optionText;
    }

    Quiz[] public quizs;
    Question[] public questions;
    Option[] public options;

    mapping(uint => address) quizIdToOwner;
    mapping(uint => uint[]) quizIdToQuestionIds;
    mapping(uint => uint[]) questionIdToOptionIds;
    mapping(uint => mapping(uint => uint)) internal questionIdToOptionScore;
    mapping(uint => uint) quizIdToTotalScore;

    event CreateQuiz(uint indexed quizId);

    /**
     * Set TeneCoin Address
     * Allow crypttorun connect to TeneCoin
     * @param teneAddress address
     */
    function setTeneCoinAddress(address teneAddress) public onlyOwner {
        teneCoinContract = TeneCoin(teneAddress);
    }

    /**
     * Create Quiz
     * Allow anyone create room
     * @param _quizName string Name of the room
     * @param _reward uint Number of TeneCoin to give the best player 
     */
    function createQuiz(string _quizName, uint _reward) public {
        uint _quizId = quizs.push(Quiz(_quizName, false, 0, _reward, msg.sender)) - 1;
        emit CreateQuiz(_quizId);
        quizIdToOwner[_quizId] = msg.sender;

        require(teneCoinContract.allowance(msg.sender, this) >= _reward, "Not approve enough money for reward");
        teneCoinContract.transferFrom(msg.sender, this, _reward);       // Send tene to the contract
    }

    /**
     * Create Question
     * Allow anyone create question from existing room
     * @param _quizId uint PIN of room
     * @param _timeLimit uint Time limit for answer
     * @param _scoreArray uint[] Score for options list
     * @param _maxScore uint Max score for this question
     * @param _questionText string Question text
     * @param _option0 string Option text 1
     * @param _option1 string Option text 2
     * @param _option2 string Option text 3
     * @param _option3 string Option text 4
     */
    function createQuestion(
        uint _quizId,
        uint _timeLimit,
        uint[] _scoreArray,
        uint _maxScore,
        string _questionText,
        string _option0,
        string _option1,
        string _option2,
        string _option3
    ) public {
        require(quizIdToOwner[_quizId] == msg.sender, "Don't have access.");
        require(_scoreArray.length == 4, "Only support 4 options");

        // Save questionIds
        uint _questionId = questions.push(Question(_questionText, _timeLimit, 0)) - 1;
        quizIdToQuestionIds[_quizId].push(_questionId);

        // Save optionIds
        uint _optionId;
        _optionId = options.push(Option(_option0)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option1)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option2)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option3)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);

        // Save option score
        for(uint i = 0; i < _scoreArray.length; i++){
            uint score = _scoreArray[i];
            questionIdToOptionScore[_questionId][i] = score;
        }

        quizIdToTotalScore[_quizId] += _maxScore;
    }
}