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
    mapping(uint => mapping(address => uint)) quizIdToUserReward;
    mapping(uint => uint) quizIdToQuestionCount;

    event SubmitAnswer(uint questionId, bool isCorrect, uint score);
    event GetReward(address user, uint reward);
    event CreateQuiz(uint quizId);
    event NextQuestion(uint currentQuestion);
    event QuizComplete(uint _quizId);
    event JoinQuiz(uint _quizId, address user);

    /**
     * Set tene coin address
     * Allow crypttorun connect to TeneCoin
     * @param teneAddress address
     */
    function setTeneCoinAddress(address teneAddress) public onlyOwner {
        teneCoinContract = TeneCoin(teneAddress);
    }

    function createQuiz(string _quizName) public {
        uint _quizId = quizs.push(Quiz(_quizName, false, 0)) - 1;
        emit CreateQuiz(_quizId);
        quizIdToOwner[_quizId] = msg.sender;
    }

    function createQuestion(
        uint _quizId,
        uint _timeLimit,
        uint _correctOption,
        string _questionText,
        string _option1,
        string _option2,
        string _option3,
        string _option4
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


    function nextQuestion(uint _quizId) public {
        require(quizIdToOwner[_quizId] == msg.sender, "Don't have access.");

        if (quizs[_quizId].currentQuestion < quizIdToQuestionIds[_quizId].length) {
            
            // Set startTime for currentQuestion
            uint _currentQuestion = quizs[_quizId].currentQuestion;
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion];
            questions[_currentQuestionId].timeStart = now;

            // Check valid time of previous question
            if(_currentQuestion > 0) {
                uint _previousQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
                require(questions[_previousQuestionId].timeStart + questions[_previousQuestionId].timeLimit < now, "Question not done!");
            }

            // Next question
            quizs[_quizId].currentQuestion++;
            emit NextQuestion(quizs[_quizId].currentQuestion);
        } else {
            quizs[_quizId].completed = true;
            emit QuizComplete(_quizId); // Last answer and show result
            
            // Loop list user in quiz
            for (uint i = 0; i < quizIdToUsersList[_quizId].length; i++)  {
                address _user = quizIdToUsersList[_quizId][i];
                // Give reward if correct answer > 50%
                if(quizIdToUserScore[_quizId][_user] * modulus > quizIdToQuestionCount[_quizId] * modulus * 50 / 100) {
                    uint _reward = 100 * modulus;
                    // teneCoinContract.earn(msg.sender, _reward);
                    quizIdToUserReward[_quizId][_user] = _reward;
                    emit GetReward(_user, _reward);
                }
            }
        }
    }

    function joinQuiz(uint _quizId) public {
        if(quizIdToUser[_quizId][msg.sender] != true) {
            quizIdToUser[_quizId][msg.sender] = true;
            quizIdToUsersList[_quizId].push(msg.sender);
        }
        emit JoinQuiz(_quizId, msg.sender);
    }

    function submitAnswer(uint _quizId, uint _questionId, uint _correctOption) public {
        require(quizIdToUser[_quizId][msg.sender] == true, "User have not joined.");
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        require(_questionId == quizIdToQuestionIds[_quizId][_currentQuestion - 1], "Wrong question index.");
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

    function getQuizUsersList(uint _quizId) public view returns (address[]) {
        return quizIdToUsersList[_quizId];
    }

    function getQuizUserScore(uint _quizId, address _user) public view returns (uint) {
        return quizIdToUserScore[_quizId][_user];
    }

    function getQuizUserReward(uint _quizId, address _user) public view returns (uint) {
        return quizIdToUserReward[_quizId][_user];
    }

    function getCurrentQuestionId(uint _quizId) public view returns (uint) {
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        if(_currentQuestion > 0) {
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
            return _currentQuestionId;
        }
    }

    function getServerTime() public view returns (uint) {
        return now;
    }
    function checkUserSubmited(uint _questionId) public view returns (bool) {
        return questionIdToUserSubmited[_questionId][msg.sender];
    }

    function getCurrentOptionIds(uint _quizId) public view returns (uint[]) {
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        if(_currentQuestion > 0) {
            uint _currentQuestionId = quizIdToQuestionIds[_quizId][_currentQuestion - 1];
            return questionIdToOptionIds[_currentQuestionId];
        }
    }

}