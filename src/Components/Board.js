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
      quizName: "",
      questionText: "",
      questionTimeLimit: 0,
      questionTimeStart: 0,
      optionsList: [],
      resultShowing: false,
      quizUsersList: []
    }
  }

  componentDidMount() {
    const { state } = this.props;

    this.getQuestionDetail();

    state.HrTest.events.JoinQuiz({}, (err, event) => {
      console.log(event);
      this.showResult();
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

    if (this.state.currentQuestion > 0) {
      const questionId = await state.HrTest.methods.getCurrentQuestionId(quizId).call();
      const questionTx = await state.HrTest.methods.questions(questionId).call();
      this.setState({
        questionText: questionTx.questionText,
        questionTimeLimit: questionTx.timeLimit,
        questionTimeStart: questionTx.timeStart
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

      setTimeout(() => {
        this.showResult();
      }, questionTx.timeLimit * 1000);
    } else {
      this.showResult();
    }
  }


  async nextQuestion(quizId) {
    const { state } = this.props;

    const tx = await state.HrTest.methods.nextQuestion(quizId).send();
    console.log(tx);

    if (tx.blockHash) {
      if (tx.events.NextQuestion) {
        this.setState({ currentQuestion: tx.events.NextQuestion.returnValues.currentQuestion });
        this.getQuestionDetail();
      } else if (tx.events.QuizComplete) {
        this.showResult();
        this.setState({ completed: true });
      }
    }

    this.setState({ resultShowing: false });
  }

  async showResult() {
    console.log("Show result");
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


    this.setState({ resultShowing: true, quizUsersList });
    console.log(quizUsersList);
  }

  render() {
    const { state } = this.props;
    const { resultShowing, quizId, quizUsersList, completed, currentQuestion, quizName, questionText, questionTimeLimit, optionsList } = this.state;
    return (
      <div className="admin container">
        <div className="row">
          <div className="col">

            <div className="card">
              <h1>Room Id: {quizId}</h1>
              <p>QuizName: {quizName}</p>
              {
                completed && 'Completed'
              }
              {
                (currentQuestion === 0 || resultShowing || completed) &&
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
                    resultShowing &&
                    <button className="btn btn-outline-info" onClick={() => this.nextQuestion(quizId)}>{currentQuestion === 0 ? "Start" : "Next"}</button>
                  }

                  {
                    currentQuestion > 0 && !resultShowing &&
                    <div>
                      <p>CurrentQuestion: {currentQuestion}</p>
                      Question: {questionText} | Time Limit: {questionTimeLimit}
                      <div>
                        {
                          optionsList.map((option, z) => {
                            return (
                              <div key={z}>
                                {option.name}
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