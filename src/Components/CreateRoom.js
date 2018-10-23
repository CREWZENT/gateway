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
            quizsList: []
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
        this.getQuizsList();
    }


    /**
     * Create card
     */
    async createQuestion() {
        const { state } = this.props;
        const {quizId, quizName, questionText, option1, option2, option3, option4, correctOption} = this.state;
        
        const tx1 = await state.HrTest.methods.createQuestion(
            quizId,
            quizName,
            questionText,
            option1,
            option2,
            option3,
            option4,
            correctOption
        ).send();

        console.log(tx1);
    }

    /**
     * Get card list
     */
    async getQuizsList() {
        const { state } = this.props;
        const quizsLength = await state.HrTest.methods.getQuizsList().call();
        let quizsList = [];
        for (let x = 0; x < quizsLength; x++) {
            const quiz = {};

            quiz.id = x;
            quiz.name = await state.HrTest.methods.quizs(x).call();
            const questionIds = await state.HrTest.methods.getQuizQuestions(x).call();
            quiz.questionsList = [];
            for (let y = 0; y < questionIds.length; y++) {
                const question = {};
                question.id = questionIds[y];
                question.name = await state.HrTest.methods.questions(question.id).call();
                const optionIds = await state.HrTest.methods.getQuestionOptions(question.id).call();
                question.optionsList = [];
                for (let z = 0; z < optionIds.length; z++) {
                    const option = {};
                    option.id = optionIds[z];
                    
                    option.name = await state.HrTest.methods.options(option.id).call();
                    question.optionsList.push(option);
                }
                quiz.questionsList.push(question);
            }
            quizsList.push(quiz);
        }
        this.setState({ quizsList });
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
                <div className="row">
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
                </div>

                <div className="row">
                    <div className="col">
                        <hr />
                        <h1>Card list</h1>

                        <div>
                            {
                                this.state.quizsList.map((quiz, x) => {
                                    return (
                                        <div key={x} className="card">
                                            <h5>QuizId: {quiz.id}</h5>
                                            QuizName: {quiz.name}
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
                                                                                <div key={z}>
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