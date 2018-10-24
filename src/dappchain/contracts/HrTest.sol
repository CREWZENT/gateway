pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./TeneCoin.sol";

contract HrTest is Ownable {

    TeneCoin teneCoinContract;
    uint modulus = 10**18;

    struct Quiz {
        string name;
        bool completed;
        uint currentQuestion;
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

    mapping(uint => mapping(address => bool)) quizIdToUser;
    mapping(uint => address[]) quizIdToUsersList;

    mapping(uint => uint[]) quizIdToQuestionIds;
    mapping(uint => uint[]) questionIdToOptionIds;
    mapping(uint => uint) questionIdToStartTime;
    mapping(uint => uint) private questionIdToCorrectOption;
    mapping(uint => mapping(address => bool)) questionIdToUserSubmited;
    mapping(uint => mapping(address => uint)) quizIdToUserScore;
    mapping(uint => uint) quizIdToQuestionCount;

    event SubmitAnswer(uint questionId, bool isCorrect, uint score);
    event GetReward(address user, uint reward);

    /**
     * Set tene coin address
     * Allow crypttorun connect to TeneCoin
     * @param teneAddress address
     */
    function setTeneCoinAddress(address teneAddress) public onlyOwner {
        teneCoinContract = TeneCoin(teneAddress);
    }

    event CreateQuiz(uint quizId);
    function createQuiz(string _quizName) public {
        uint _quizId = quizs.push(Quiz(_quizName, false, 0)) - 1;
        emit CreateQuiz(_quizId);
        quizIdToOwner[_quizId] = msg.sender;
    }

    function createQuestion(
        uint _quizId,
        uint _timeLimit,
        string _questionText,
        string _option1,
        string _option2,
        string _option3,
        string _option4,
        uint _correctOption
    ) public {
        require(quizIdToOwner[_quizId] == msg.sender, "Don't have access.");

        // Save questionIds
        uint _questionId = questions.push(Question(_questionText, _timeLimit, 0)) - 1;
        quizIdToQuestionIds[_quizId].push(_questionId);

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
        quizIdToQuestionCount[_quizId]++;
    }

    event NextQuestion(uint currentQuestion);
    event QuizComplete(uint _quizId);
    function nextQuestion(uint _quizId) public {
        require(quizIdToOwner[_quizId] == msg.sender, "Don't have access.");

        if (quizs[_quizId].currentQuestion < quizIdToQuestionIds[_quizId].length) {
            uint _index = quizs[_quizId].currentQuestion;
            uint _questionId = quizIdToQuestionIds[_quizId][_index];
            require(questions[_questionId].timeStart + questions[_questionId].timeLimit < now, "Question not done!");

            quizs[_quizId].currentQuestion++;
            emit NextQuestion(quizs[_quizId].currentQuestion);
            questions[_questionId].timeStart = now;
        } else {
            emit QuizComplete(_quizId); // Last answer and show result
            
            // Loop list user in quiz
            for (uint i = 0; i < quizIdToUsersList[_quizId].length; i++)  {
                address _user = quizIdToUsersList[_quizId][i];
                // Give reward if correct answer > 50%
                if(quizIdToUserScore[_quizId][_user] * modulus > quizIdToQuestionCount[_quizId] * modulus * 50 / 100) {
                    uint _reward = 100 * modulus;
                    // teneCoinContract.earn(msg.sender, _reward);
                    emit GetReward(_user, _reward);
                }
            }
        }
    }

    event JoinQuiz(uint _quizId, address user);
    function joinQuiz(uint _quizId) public {
        if(quizIdToUser[_quizId][msg.sender] != true) {
            quizIdToUser[_quizId][msg.sender] = true;
            quizIdToUsersList[_quizId].push(msg.sender);
        }
        emit JoinQuiz(_quizId, msg.sender);
    }

    // event TimesUp();
    // function timesUp() public {
    //     emit TimesUp();
    // }

    function submitAnswer(uint _quizId, uint _questionId, uint _correctOption) public {
        require(quizIdToUser[_quizId][msg.sender] == true, "User have not joined.");
        uint _index = quizs[_quizId].currentQuestion;
        require(_questionId == quizIdToQuestionIds[_quizId][_index - 1], "Wrong question index.");
        require(questions[_questionId].timeStart + questions[_questionId].timeLimit >= now);

        // Prevent re-answer
        require(!questionIdToUserSubmited[_questionId][msg.sender], "Already submited.");
        questionIdToUserSubmited[_questionId][msg.sender] = true;

        // Calculate score
        bool isCorrect = questionIdToCorrectOption[_questionId] == _correctOption;
        if(isCorrect) {
            quizIdToUserScore[_quizId][msg.sender]++;
        }
        
        // Show result
        emit SubmitAnswer(_questionId, isCorrect, quizIdToUserScore[_quizId][msg.sender]);
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