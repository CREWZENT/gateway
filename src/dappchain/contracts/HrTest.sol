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
    mapping(uint => mapping(uint => uint)) private questionIdToOptionScore;
    mapping(uint => mapping(address => bool)) questionIdToUserSubmited;
    mapping(uint => mapping(address => uint)) quizIdToUserScore;
    mapping(uint => mapping(address => uint)) quizIdToUserReward;
    mapping(uint => uint) quizIdToTotalScore;
    mapping(uint => bool) questionIdToSubmitedAll;

    event SubmitedAll(uint indexed quizId, uint questionId);
    event SubmitAnswer(uint indexed quizId, uint indexed questionId, uint score, uint totalScore);
    event GetReward(uint indexed quizId, address user, uint reward);
    event CreateQuiz(uint indexed quizId);
    event NextQuestion(uint indexed quizId, uint currentQuestion);
    event QuizComplete(uint indexed quizId);
    event JoinQuiz(uint indexed quizId, address user);

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
                bool enoughTime = questions[_previousQuestionId].timeStart + questions[_previousQuestionId].timeLimit < now;
                require(enoughTime || questionIdToSubmitedAll[_previousQuestionId], "Question not done!");
            }

            // Next question
            quizs[_quizId].currentQuestion++;
            emit NextQuestion(_quizId, quizs[_quizId].currentQuestion);
        } else {
            quizs[_quizId].completed = true;
            emit QuizComplete(_quizId); // Last answer and show result
            
            // Loop list user in quiz
            for (uint i = 0; i < quizIdToUsersList[_quizId].length; i++)  {
                address _user = quizIdToUsersList[_quizId][i];
                // Give reward if correct answer > 50%
                if(quizIdToUserScore[_quizId][_user] * modulus > quizIdToTotalScore[_quizId] * modulus * 50 / 100) {
                    uint _reward = 100 * modulus;
                    // teneCoinContract.earn(msg.sender, _reward);
                    quizIdToUserReward[_quizId][_user] = _reward;
                    emit GetReward(_quizId, _user, _reward);
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

    function submitAnswer(uint _quizId, uint _questionId, uint _selectedOption) public {
        require(quizIdToUser[_quizId][msg.sender] == true, "User have not joined.");
        uint _currentQuestion = quizs[_quizId].currentQuestion;
        require(_questionId == quizIdToQuestionIds[_quizId][_currentQuestion - 1], "Wrong question index.");
        require(questions[_questionId].timeStart + questions[_questionId].timeLimit >= now);

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