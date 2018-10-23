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
            id: props.match.params.roomId,
            name: "",
            questionsList: []
        }
    }

    componentDidMount() {
        this.getQuizDetail();
    }

    /**
     * Get card list
     */
    async getQuizDetail() {
        const { state } = this.props;
        const id = this.state.id;
        const name = await state.HrTest.methods.quizs(id).call();
        this.setState({ name });

        const questionIds = await state.HrTest.methods.getQuizQuestions(id).call();
        const questionsList = [];
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
            questionsList.push(question);
        }
        this.setState({ questionsList })
    }

    async submitAnswer(quizId, questionId, choosedOption) {
        const { state } = this.props;
        const tx = await state.HrTest.methods.submitAnswer(quizId, questionId, choosedOption).send();
        console.log(tx);
    }

    render() {
        const { id, name, questionsList } = this.state;
        return (
            <div className="admin container">
                <div className="row">
                    <div className="col">

                        <div className="card">
                            <h1>QuizId: {id}</h1>
                            QuizName: {name}
                            {
                                questionsList.map((question, y) => {
                                    return (
                                        <div key={y}>
                                            Question Name: {question.name}
                                            <div>
                                                {
                                                    question.optionsList.map((option, z) => {
                                                        return (
                                                            <div key={z} onClick={() => this.submitAnswer(id, question.id, z)}>
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