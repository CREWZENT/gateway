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
    state.HrTest.events.NextQuestion({}, (err, event) => {
      console.log(event);
      this.setState({ showResult: false, submited: false });
      this.getQuestionDetail();
    });

    state.HrTest.events.QuizComplete({}, (err, event) => {
      console.log(event);
      this.calculateResult();
      this.setState({ completed: true });
    });

    state.HrTest.events.JoinQuiz({}, (err, event) => {
      console.log(event);
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
      const countDown = setInterval(() => {
        if (count > 0) {
          count -= 1;
          this.setState({ questionTimeLeft: count });
        } else {
          clearInterval(countDown);
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
    this.setState({ submited: true });
    console.log(tx);
  }

  async calculateResult() {
    console.log("Calculate result");

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

    this.setState({ quizUsersList });
  }

  render() {
    const { state } = this.props;
    const { showResult, submited, quizUsersList, completed, currentQuestion, questionText, questionTimeLeft, optionsList } = this.state;
    return (
      <div className="admin container">
        <div className="row">
          <div className="col">

            <div className="card">
              {
                completed && 'Completed'
              }
              {
                (currentQuestion === 0 || showResult || completed) &&
                <div>
                  <h3>Users List:</h3>
                  {
                    quizUsersList.map((quizUser, i) => {
                      return (
                        <div key={i} style={{ 'background': quizUser.address === state.user.address ? "#f1f1f1" : "" }}>
                          {quizUser.displayName} | Score: {quizUser.score} | Reward: {quizUser.reward}
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
                    <div>
                      You're too fast!!!
                    </div>
                  }
                  {
                    currentQuestion > 0 && !showResult && !submited &&
                    <div>
                    Question: {questionText} | Time Left: {questionTimeLeft > 0 && questionTimeLeft}
                      <div>
                        {
                          optionsList.map((option, z) => {
                            return (
                              <div key={z}>
                                <button className="btn btn-outline-success" onClick={() => this.submitAnswer(z)}>
                                  {option.name}
                                </button>

                              </div>
                            )
                          })
                        }

                      </div>
                    </div>
                  }
                </div>
              }


            </div>

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