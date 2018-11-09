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
      quizList: []
    }
  }

  componentDidMount() {
    this.getQuizList();
  }

  async getQuizList() {
    const { state } = this.props;
    const quizLength = await state.HrTest.methods.getQuizLength().call();

    const quizList = [];
    // Get last 10 quizs
    for (let i = quizLength - 1; i >= 0 && i > quizLength - 10; i--) {
      let quiz = {};
      quiz.quizId = i;
      quiz = Object.assign(quiz, await state.HrTest.methods.quizs(quiz.quizId).call());
      quiz.questionsList = await this.getQuestionsList(quiz.quizId);
      quiz.usersList = await this.getUsersList(quiz.quizId);
      quizList.push(quiz);
    }
    this.setState({ quizList });
  }

  async getQuestionsList(quizId) {
    const { state } = this.props;
    const questionIds = await state.HrTest.methods.getQuizQuestionIds(quizId).call();
    const questionsList = [];
    for (let i = 0; i < questionIds.length; i++) {
      let question = {};
      question.questionId = questionIds[i];
      question = Object.assign(question, await state.HrTest.methods.questions(question.questionId).call());
      question.optionsList = await this.getOptionsList(quizId, question.questionId);
      questionsList.push(question);
    }
    return questionsList;
  }

  async getOptionsList(quizId, questionId) {
    const { state } = this.props;
    const optionIds = await state.HrTest.methods.getOptionIds(questionId).call();
    const optionsList = [];
    for (let i = 0; i < optionIds.length; i++) {
      let option = {};
      option.optionId = optionIds[i];
      option.optionText = await state.HrTest.methods.options(option.optionId).call();
      optionsList.push(option);
    }
    return optionsList;
  }

  async getUsersList(quizId) {
    const { state } = this.props;

    const usersList = [];

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

      usersList.push(quizUser)
    }

    return usersList;
  }

  render() {
    // const { state } = this.props;
    const { quizList } = this.state;
    return (
      <div className="analytic container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h1 className="mt-5"><b>Quiz History</b></h1>
            <div id="accordion">

              {
                quizList.map((quiz, x) => {
                  return (
                    <div key={x} className="card historyCard">
                      <div className="card-header" id={"headingThree"}>
                        <h5 className="mb-0 text-left">
                          <button className="btn btn-link collapsed" data-toggle="collapse" data-target={`#collapse${x}`} aria-expanded="false" aria-controls="collapseThree">
                            <b>{quiz.name} Quiz</b><small> ({quiz.usersList.length} Users, {quiz.questionsList.length} Questions)</small>
                          </button>
                        </h5>
                      </div>
                      <div id={`collapse${x}`} className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
                        <div className="card-body">
                          {
                            quiz.usersList.length > 0 &&
                            <div>
                              <h6><b>User List</b></h6>
                              {
                                quiz.usersList.map((quizUser, i) => {
                                  return (
                                    <div className="text-left" key={i}>
                                      <img className="profile" src={quizUser.photoURL} alt="" />
                                      <b> {quizUser.displayName}</b> | Score: {quizUser.score} | Reward: {quizUser.reward}
                                    </div>
                                  )
                                })
                              }

                              <hr />
                              <hr />
                            </div>
                          }

                          <h6><b>Question List</b></h6>
                          <table className="historyDetail table">
                            <tbody className="text-left">
                              {
                                quiz.questionsList.map((question, y) => {
                                  return (
                                    <tr key={y}>
                                      <td>{question.questionText}</td>
                                      <td>
                                        <ol>
                                          {
                                            question.optionsList.map((option, z) => {
                                              return (
                                                <li key={z}>{option.optionText}</li>
                                              );
                                            })
                                          }
                                        </ol>

                                      </td>

                                    </tr>
                                  );
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })
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