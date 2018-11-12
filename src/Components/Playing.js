/**
 * Admin page
 * @dev Allows contract owner create and manage default card template
 * @dev Used to generate hero when someone buy in marketplace
 * @dev CRUD base cards, only owner have permission
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import firebase from '../FirebaseConfig';
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
let countDownInterval;
let rank1 = require('../assets/img/top_1.png');
let rank2 = require('../assets/img/top_2.png');
let rank3 = require('../assets/img/top_3.png');


let listForFast = ['You are so fast!!!', 
                    'Fast and Furious 10 ???', 
                    'Please wait another player...', 
                    'Sometime random is better, right?',
                    'Overconfident can destroy you!!',
                    'You need to wait...dont sleep...zZZ',
                    'Let see the time countdown!',
                    'Dog Cat Pig Chicken!!!']
let fastItem = listForFast[Math.floor(Math.random() * Math.floor(8))];

class DefaultName extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quizId: props.match.params.quizId,
      completed: false,
      currentQuestion: 0,
      currentQuestionId: 0,
      quizName: "",
      questionText: "",
      questionTimeLimit: 0,
      questionTimeStart: 0,
      questionTimeLeft: 0,
      optionsList: [],
      showResult: false,
      quizUsersList: [],
      submited: false
    }
  }

  componentDidMount() {

    const { state } = this.props;

    this.getQuestionDetail();
    state.HrTest.events.NextQuestion({ filter: { quizId: this.state.quizId } }, (err, event) => {
      //console.log('NextQuestion');
      this.setState({ showResult: false, submited: false });
      this.getQuestionDetail();
    });

    state.HrTest.events.SubmitedAll({ filter: { quizId: this.state.quizId } }, (err, event) => {
      //console.log('SubmitedAll');
      clearInterval(countDownInterval);
      this.calculateResult();
      this.setState({ showResult: true, submited: false });
    });

    state.HrTest.events.QuizComplete({ filter: { quizId: this.state.quizId } }, (err, event) => {
      //console.log('QuizComplete');
      this.calculateResult();
      this.setState({ completed: true });
    });

    state.HrTest.events.JoinQuiz({ filter: { quizId: this.state.quizId } }, (err, event) => {
      //console.log('JoinQuiz');
      this.calculateResult();
    });
  }


  /**
   * Get card list
   */
  async getQuestionDetail() {
    const { state } = this.props;
    const quizId = this.state.quizId;
    const quiz = await state.HrTest.methods.quizs(this.state.quizId).call();
    this.setState({ completed: quiz.completed, currentQuestion: Number(quiz.currentQuestion), quizName: quiz.name });

    if (quiz.currentQuestion > 0) {
      const questionId = await state.HrTest.methods.getCurrentQuestionId(quizId).call();
      const questionTx = await state.HrTest.methods.questions(questionId).call();
      const serverTime = await state.HrTest.methods.getServerTime().call();
      const submited = await state.HrTest.methods.checkUserSubmited(questionId).call();

      questionTx.questionTimeLeft = questionTx.timeLimit - (serverTime - questionTx.timeStart);
      this.setState({
        currentQuestionId: questionId,
        questionText: questionTx.questionText,
        questionTimeLimit: questionTx.timeLimit,
        questionTimeStart: questionTx.timeStart,
        questionTimeLeft: questionTx.questionTimeLeft,
        submited: submited
      });

      const optionIds = await state.HrTest.methods.getCurrentOptionIds(quizId).call();
      const optionsList = [];
      for (let z = 0; z < optionIds.length; z++) {
        const option = {};
        option.quizId = optionIds[z];
        option.name = await state.HrTest.methods.options(optionIds[z]).call();
        optionsList.push(option);
      }
      this.setState({ optionsList });

      let count = questionTx.questionTimeLeft;

      countDownInterval = setInterval(() => {
        if (count > 0) {
          count -= 1;
          this.setState({ questionTimeLeft: count });
        } else if (this.state.showResult === false) {
          clearInterval(countDownInterval);
          this.calculateResult();
          this.setState({ showResult: true });
        }
      }, 1000);
    } else {
      this.calculateResult();
      this.setState({ showResult: true });
    }
  }

  async submitAnswer(choosedOption) {
    const { state } = this.props;
    const { quizId, currentQuestionId } = this.state;
    const tx = await state.HrTest.methods.submitAnswer(quizId, currentQuestionId, choosedOption).send();
    if (tx.blockHash) {
      this.setState({ submited: true });
      // console.log("SubmitAnswer");
    }
    fastItem = listForFast[Math.floor(Math.random() * Math.floor(8))];
  }

  async calculateResult() {
    // console.log("Calculate result");

    const { state } = this.props;
    const { quizId } = this.state;

    const quizUsersList = [];

    const quizUsers = await state.HrTest.methods.getQuizUsersList(quizId).call();
    for (let i = 0; i < quizUsers.length; i++) {
      let quizUser = {};
      quizUser.address = quizUsers[i];
      quizUser.score = await state.HrTest.methods.getQuizUserScore(quizId, quizUser.address).call();
      quizUser.reward = await state.HrTest.methods.getQuizUserReward(quizId, quizUser.address).call();

      await new Promise((resolve, reject) => {
        db.collection('users').where("address", "==", quizUser.address.toLowerCase()).limit(1).get().then((querySnapshot) => {
          querySnapshot.forEach(async (doc) => {
            let user = doc.data();
            quizUser = Object.assign(quizUser, user);
            resolve();
          })
        })
      })

      quizUsersList.push(quizUser)
    }

    quizUsersList.sort((a, b) => {
      return b.score - a.score;
    });
    this.setState({ quizUsersList });
  }

  getScoreIcon(index) {
    if (index === 1) {
      return rank1;
    } else if (index === 2) {
      return rank2;
    } else {
      return rank3;
    }
  }

  render() {
    const { showResult, quizId, submited, quizUsersList, completed, currentQuestion, questionText, questionTimeLeft, optionsList } = this.state;
    return (
      <div className="playing">
        <div>
            <div>
              {
                (currentQuestion === 0) &&
              <div className="playing-header"> 
                <h1>PIN Code</h1> 
                 <p className="playing-room-id">{quizId}</p>
              </div>
              }
              {/* <div className="h-line-slim"/> */}
              
                {
                  completed && 'Completed'
                }
              {
                (currentQuestion === 0 || showResult || completed) &&
                <div>
                  {
                    quizUsersList
                        .map((quizUser, i) => {
                      return (
                        <div key={i} className="user-list">
                        <div className="user">
                          <div className="user-avatar" style={{ 'background': 'url(' + quizUser.photoURL + '?width=64)'}}></div>
                          <div className="user-infos">
                            <div className="user-info">{quizUser.displayName}</div>
                            <div className="user-info-2">Score: {quizUser.score} | Reward: {quizUser.reward/10**18}</div>
                            <div className="user-info-3" style={{ 'backgroundImage': 'url(' + this.getScoreIcon(i+1) + ')'}} >{i + 1}</div>
                          </div>
                        </div>
                        
                        </div>
                      )
                    })
                  }
                </div>
              }
              {
                !completed &&
                <div>
                  {
                    currentQuestion > 0 && !showResult && submited &&
                    <div className="playing-result-info">
                      <div className="playing-fast-text">{fastItem}</div>

                      <div className="bubbles">
                        <h1> Next Question: {questionTimeLeft > 0 && questionTimeLeft} </h1>
                          {/* <div className="playing-time-next-question"> Next Question: {questionTimeLeft > 0 && questionTimeLeft}  </div> */}
                      </div>
                    </div>

                  }
                  {
                    currentQuestion > 0 && !showResult && !submited &&
                    
                    <div>
                      <p className="current-question">Question {currentQuestion}</p>
                      <div className="question-text">{questionText} </div>
                      {/* <div className="h-line-slim"/> */}
                      <div className="question-time-left"> Time Left: {questionTimeLeft > 0 && questionTimeLeft} </div>
                      <div className= "question-container">
                        {
                          optionsList.map((option, z) => {
                            return (
                              <div key={z} className = {"board-question-" + (z + 1) } onClick={() => this.submitAnswer(z)}>
                              </div>
                            )
                          })
                        }
                      </div>
                    </div>
                  }
                    {/* <div>
                      Question: {questionText} | Time Left: {questionTimeLeft > 0 && questionTimeLeft}
                      <div>
                        {
                          optionsList.map((option, z) => {
                            return (
                              <div key={z}>
                                <p className="btn btn-outline-success btn-answer" onClick={() => this.submitAnswer(z)}>
                                  {option.name}
                                </p>

                              </div>
                            )
                          })
                        }

                      </div>
                    </div> */}
                </div>
              }


            </div>

        </div>

      </div>
    );
  }
}

export default DefaultName = connect(
  (state) => {
    return { state };
  },
  (dispatch) => {
    return { dispatch };
  },
)(DefaultName);