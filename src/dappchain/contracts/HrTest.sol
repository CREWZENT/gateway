pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TeneCoin.sol";

contract HrTest is Ownable {

    TeneCoin teneCoinContract;
    uint modulus = 10**18;


    // struct Templates {
    //     string name;
    // }
    // Templates[] public templates;


    struct Quiz {
        string name;
    }
    struct Question {
        string questionText;
    }
    struct Option {
        string optionText;
    }

    Quiz[] public quizs;
    Question[] public questions;
    Option[] public options;

    mapping(uint => address) quizIdToOwner;

    mapping(uint => mapping(address => bool)) quizIdToUser;
    mapping(uint => address[]) quizIdToUsersList;

    mapping(uint => uint[]) quizIdToQuestionIds;
    mapping(uint => uint[]) questionIdToOptionIds;
    mapping(uint => uint) private questionIdToCorrectOption;
    mapping(uint => mapping(address => bool)) questionIdToUserSubmited;
    mapping(uint => mapping(address => uint)) quizIdToUserScore;
    mapping(uint => uint) quizIdToQuestionCount;

    event SubmitAnswer(uint questionId, bool isCorrect, bool isDone, uint score);
    event GetReward(address user, uint reward);

    /**
     * Set tene coin address
     * Allow crypttorun connect to TeneCoin
     * @param teneAddress address
     */
    function setTeneCoinAddress(address teneAddress) public onlyOwner {
        teneCoinContract = TeneCoin(teneAddress);
    }

    function createQuestion(
        uint _quizId,
        string _quizName,
        string _questionText,
        string _option1,
        string _option2,
        string _option3,
        string _option4,
        uint _correctOption
    ) public {
        uint quizId;
        if(quizIdToOwner[_quizId] == address(0)) {
            quizId = quizs.push(Quiz(_quizName)) - 1;
            quizIdToOwner[quizId] = msg.sender;
        } else {
            quizId = _quizId;
        }

        // Save questionIds
        uint _questionId = questions.push(Question(_questionText)) - 1;
        quizIdToQuestionIds[quizId].push(_questionId);

        // Save optionIds
        uint _optionId;
        _optionId = options.push(Option(_option1)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option2)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option3)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);
        _optionId = options.push(Option(_option4)) - 1;
        questionIdToOptionIds[_questionId].push(_optionId);

        // Save correct option
        questionIdToCorrectOption[_questionId] = _correctOption;
        quizIdToQuestionCount[quizId]++;
    }

    function submitAnswer(uint _quizId, uint _questionId, uint _correctOption) public {
        // Prevent re-answer
        require(!questionIdToUserSubmited[_questionId][msg.sender], "Already submited.");
        questionIdToUserSubmited[_questionId][msg.sender] = true;

        if(quizIdToUser[_quizId][msg.sender] != true) {
            quizIdToUser[_quizId][msg.sender] = true;
            quizIdToUsersList[_quizId].push(msg.sender);
        }

        // Calculate score
        bool isCorrect = questionIdToCorrectOption[_questionId] == _correctOption;
        if(isCorrect) {
            quizIdToUserScore[_quizId][msg.sender]++;
        }
        
        // Check last answer and show result, give reward
        bool isDone = true;
        for(uint i = 0; i < quizIdToQuestionIds[_quizId].length; i++) {
            uint questionId = quizIdToQuestionIds[_quizId][i];
            bool answeredQuestionId = questionIdToUserSubmited[questionId][msg.sender];
            if(!answeredQuestionId) {
                isDone = false;
                break;
            }
        }
        // Show result
        emit SubmitAnswer(_questionId, isCorrect, isDone, quizIdToUserScore[_quizId][msg.sender]);
        // Give reward if correct answer > 50%
        if(isDone && quizIdToUserScore[_quizId][msg.sender] * modulus > quizIdToQuestionCount[_quizId] * modulus * 50 / 100) {
            uint _reward = 100 * modulus;
            // teneCoinContract.earn(msg.sender, _reward);
            emit GetReward(msg.sender, _reward);
        }
    }

    function getQuizsList() public view returns (uint) {
        return quizs.length;
    }

    function getQuizUsersList(uint _quizId) public view returns (address[]) {
        return quizIdToUsersList[_quizId];
    }

    function getQuizQuestions(uint _quizId) public view returns (uint[]) {
        return quizIdToQuestionIds[_quizId];
    }

    function getQuestionOptions(uint _questionId) public view returns (uint[]) {
        return questionIdToOptionIds[_questionId];
    }



}