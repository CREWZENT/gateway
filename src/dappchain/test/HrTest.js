const HrTest = artifacts.require('HrTest');
const TeneCoin = artifacts.require('TeneCoin');
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

contract('HrTest', async (accounts) => {
    let teneCoin;
    let hrTest;
    let modulus = 10 ** 18;

    it("Should create contract", async () => {
        teneCoin = await TeneCoin.new(0, "TeneCoin", "Tene");
        hrTest = await HrTest.new();
        let name = await teneCoin.name();
        assert.equal("TeneCoin", name);
    })

    it("Should connect 2 contract", async () => {
        const tx1 = await hrTest.setTeneCoinAddress(teneCoin.address);
        const tx2 = await teneCoin.grantAccessMint(hrTest.address);
        assert(tx1);
        assert(tx2);
    })

    it('Should create quiz', async () => {
        await hrTest.createQuiz("Quiz 1");
        const quiz = await hrTest.quizs(0);
        assert.equal("Quiz 1", quiz[0]);
        assert.equal(false, quiz[1]);
        assert.equal(0, quiz[2].toNumber());
    });

    it('Should create question', async () => {
        await hrTest.createQuestion(0, 3, [1, 2, 3, 4], 4 , "This is question 1",
        "Question 1 - Answer 1", "Question 1 - Answer 2", "Question 1 - Answer Answer 3", "Question 1 - Answer Answer 4");

        await hrTest.createQuestion(0, 3, [1, 2, 3, 4], 4, "This is question 2",
        "Question 2 - Answer 1", "Question 2 - Answer 2", "Question 2 - Answer Answer 3", "Question 2 - Answer Answer 4");

        await hrTest.createQuestion(0, 3, [1, 2, 3, 4], 4, "This is question 3",
        "Question 3 - Answer 1", "Question 3 - Answer 2", "Question 3 - Answer Answer 3", "Question 3 - Answer Answer 4");

        const question1 = await hrTest.questions(0);
        const question2 = await hrTest.questions(1);
        const question3 = await hrTest.questions(2);
        assert.equal("This is question 1",  question1[0]);
        assert.equal("This is question 2",  question2[0]);
        assert.equal("This is question 3",  question3[0]);
    });

    it("Should join room", async () => {
        await hrTest.joinQuiz(0, { from: accounts[1] });
        // assert.equal(true, await hrTest.quizIdToUser.call(0, accounts[1]))
    });

    it("Should nextQuestion 1", async () => {
        await hrTest.nextQuestion(0, { from: accounts[0] });
        let quiz = await hrTest.quizs(0);
        assert.equal(1, quiz[2].toNumber()); // currentQuestion = 1
    });

    it('Submit answer 1', async () => {
        const tx = await hrTest.submitAnswer(0, 0, 2, { from: accounts[1] });
        assert.equal(0, tx.logs[0].args.questionId.toNumber());
        assert.equal(3, tx.logs[0].args.score.toNumber());
    });

    it("Should nextQuestion 2", async () => {
        await snooze(5000);
        await hrTest.nextQuestion(0, { from: accounts[0] });
        let quiz = await hrTest.quizs(0);
        assert.equal(2, quiz[2].toNumber()); // currentQuestion = 2
    });

    it('Submit answer 2', async () => {
        const tx = await hrTest.submitAnswer(0, 1, 2, { from: accounts[1] });
        assert.equal(1, tx.logs[0].args.questionId.toNumber());
        assert.equal(3, tx.logs[0].args.score.toNumber());
    });

    it("Should nextQuestion 3", async () => {
        await snooze(5000);
        await hrTest.nextQuestion(0, { from: accounts[0] });
        let quiz = await hrTest.quizs(0);
        assert.equal(3, quiz[2].toNumber()); // currentQuestion = 3
    });

    it('Submit answer 3', async () => {
        const tx = await hrTest.submitAnswer(0, 2, 1, { from: accounts[1] });
        assert.equal(2, tx.logs[0].args.questionId.toNumber());
        assert.equal(2, tx.logs[0].args.score.toNumber());
        assert.equal(8, tx.logs[0].args.totalScore.toNumber());
    });

    it("Should finished", async () => {
        await snooze(5000);
        await hrTest.nextQuestion(0, { from: accounts[0] });
        let quiz = await hrTest.quizs(0);
        assert.equal(3, quiz[2].toNumber()); // currentQuestion = 3
    });

})