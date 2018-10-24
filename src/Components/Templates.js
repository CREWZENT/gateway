/**
 * Admin page
 * @dev Allows contract owner create and manage default card template
 * @dev Used to generate hero when someone buy in marketplace
 * @dev CRUD base cards, only owner have permission
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

class DefaultName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizId: 99,
            quizName: "Name of the quiz",
            questionText: "What do you want to ask?",
            option1: "Here is the option 1",
            option2: "Here is the option 2",
            option3: "Here is the option 3",
            option4: "Here is the option 4",
            correctOption: 2,

            quizsList: [
                {
                    name: "Name of the template 1",
                    questionsList: [
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 1?",
                            optionsList: [
                                { name: "Here is the option 1 of question 1" },
                                { name: "Here is the option 2 of question 1" },
                                { name: "Here is the option 3 of question 1" },
                                { name: "Here is the option 4 of question 1" },
                            ]
                        },
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 2?",
                            optionsList: [
                                { name: "Here is the option 1 of question 2" },
                                { name: "Here is the option 2 of question 2" },
                                { name: "Here is the option 3 of question 2" },
                                { name: "Here is the option 4 of question 2" },
                            ]
                        },
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 3?",
                            optionsList: [
                                { name: "Here is the option 1 of question 3" },
                                { name: "Here is the option 2 of question 3" },
                                { name: "Here is the option 3 of question 3" },
                                { name: "Here is the option 4 of question 3" },
                            ]
                        }

                    ]
                },
                {
                    name: "Name of the template 2",
                    questionsList: [
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 1?",
                            optionsList: [
                                { name: "Here is the option 1 of question 1" },
                                { name: "Here is the option 2 of question 1" },
                                { name: "Here is the option 3 of question 1" },
                                { name: "Here is the option 4 of question 1" },
                            ]
                        },
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 2?",
                            optionsList: [
                                { name: "Here is the option 1 of question 2" },
                                { name: "Here is the option 2 of question 2" },
                                { name: "Here is the option 3 of question 2" },
                                { name: "Here is the option 4 of question 2" },
                            ]
                        },
                        {
                            timeLimit: 5,
                            correctOption: 2,
                            name: "What do you want to ask 3?",
                            optionsList: [
                                { name: "Here is the option 1 of question 3" },
                                { name: "Here is the option 2 of question 3" },
                                { name: "Here is the option 3 of question 3" },
                                { name: "Here is the option 4 of question 3" },
                            ]
                        }

                    ]
                }
            ]
        }

        this.changeQuizId = this.changeQuizId.bind(this);
        this.changeQuizName = this.changeQuizName.bind(this);
        this.changeQuestionText = this.changeQuestionText.bind(this);
        this.changeOption1 = this.changeOption1.bind(this);
        this.changeOption2 = this.changeOption2.bind(this);
        this.changeOption3 = this.changeOption3.bind(this);
        this.changeOption4 = this.changeOption4.bind(this);
        this.changeCorrectOption = this.changeCorrectOption.bind(this);
    }

    componentDidMount() {

    }

    async createQuiz(quiz) {
        const { state } = this.props;
        const tx = await state.HrTest.methods.createQuiz(quiz.name).send();
        console.log(tx);

        if (tx.blockHash) {
            const quizId = tx.events.CreateQuiz.returnValues.quizId;
            this.createQuestion(quizId, quiz);
        }
    }

    /**
     * Create card
     */
    async createQuestion(quizId, quiz) {
        const { state } = this.props;
        let error = false;
        for (let i = 0; i < quiz.questionsList.length; i++) {
            const question = quiz.questionsList[i];
            const questionName = question.name;

            const option1 = question.optionsList[0].name;
            const option2 = question.optionsList[1].name;
            const option3 = question.optionsList[2].name;
            const option4 = question.optionsList[3].name;

            const tx = await state.HrTest.methods.createQuestion(
                quizId,
                question.timeLimit,
                question.correctOption,
                questionName,
                option1,
                option2,
                option3,
                option4,
            ).send();
            console.log(tx);
            if(!tx.blockHash) {
                error = true;
            }
        }
        if(error === false) {
            window.location = `/board/${quizId}`;
        }
    }


    /**
     * Handle input change
     */
    changeQuizId(e) {
        this.setState({ quizId: e.target.value });
    }
    changeQuizName(e) {
        this.setState({ quizName: e.target.value });
    }
    changeQuestionText(e) {
        this.setState({ questionText: e.target.value });
    }
    changeOption1(e) {
        this.setState({ option1: e.target.value });
    }
    changeOption2(e) {
        this.setState({ option2: e.target.value });
    }
    changeOption3(e) {
        this.setState({ option3: e.target.value });
    }
    changeOption4(e) {
        this.setState({ option4: e.target.value });
    }
    changeCorrectOption(e) {
        this.setState({ correctOption: e.target.value });
    }

    render() {

        return (
            <div className="admin container">
                {/* <div className="row">
                    <div className="col-3"></div>
                    <div className="col-6">
                        <h1 className="mt-3 text-center">Create Test</h1>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="form-group">
                                <label>QuizId:</label>
                                <input type="number" className="form-control" placeholder="QuizId" value={this.state.quizId} onChange={this.changeQuizId} />
                            </div>
                            <div className="form-group">
                                <label>QuizName:</label>
                                <input type="text" className="form-control" placeholder="Name of the quiz" value={this.state.quizName} onChange={this.changeQuizName} />
                            </div>
                            <div className="form-group">
                                <label>QuestionText:</label>
                                <input type="text" className="form-control" placeholder="What do you want to ask?" value={this.state.questionText} onChange={this.changeQuestionText} />
                            </div>

                            <div className="form-group">
                                <label>Option1:</label>
                                <input type="text" className="form-control" placeholder="Option1" value={this.state.option1} onChange={this.changeOption1} />
                            </div>
                            <div className="form-group">
                                <label>Option2:</label>
                                <input type="text" className="form-control" placeholder="Option2" value={this.state.option2} onChange={this.changeOption2} />
                            </div>
                            <div className="form-group">
                                <label>Option3:</label>
                                <input type="text" className="form-control" placeholder="Option3" value={this.state.option3} onChange={this.changeOption3} />
                            </div>
                            <div className="form-group">
                                <label>Option4:</label>
                                <input type="text" className="form-control" placeholder="Option4" value={this.state.option4} onChange={this.changeOption4} />
                            </div>
                            <div className="form-group">
                                <label>CorrectOption:</label>
                                <input type="number" min="0" max="3" className="form-control" placeholder="CorrectOption" value={this.state.correctOption} onChange={this.changeCorrectOption} />
                            </div>

                            <button className="btn btn-success m-2" onClick={() => this.createQuestion()}>Create Question</button>
                            <button className="btn btn-outline-primary" onClick={() => this.updateQuestion()}>Update Question</button>
                        </form>
                    </div>
                    <div className="col-3"></div>
                </div> */}

                <div className="row">
                    <div className="col">
                        <hr />
                        <h1>Quiz list</h1>

                        <div>
                            {
                                this.state.quizsList.map((quiz, x) => {
                                    return (
                                        <div key={x} className="card mt-5" onClick={() => this.createQuiz(quiz)}>
                                            <h5>QuizName: {quiz.name}</h5>
                                            <div>
                                                {
                                                    quiz.questionsList.map((question, y) => {
                                                        return (
                                                            <div key={y}>
                                                                Question Name: {question.name}
                                                                <div>
                                                                    {
                                                                        question.optionsList.map((option, z) => {
                                                                            return (
                                                                                <div key={z} style={{ 'background': z === question.correctOption ? '#f1f1f1' : "" }}>
                                                                                    {option.name}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }

                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
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