const HrTest = artifacts.require('HrTest');
const TeneCoin = artifacts.require('TeneCoin');

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
        await hrTest.createQuestion(0, "Quiz 1", "This is question 1",
        "Question 1 - Answer 1", "Question 1 - Answer 2", "Question 1 - Answer Answer 3", "Question 1 - Answer Answer 4", 2);

        await hrTest.createQuestion(0, "Quiz 1", "This is question 2",
        "Question 2 - Answer 1", "Question 2 - Answer 2", "Question 2 - Answer Answer 3", "Question 2 - Answer Answer 4", 2);

        await hrTest.createQuestion(0, "Quiz 1", "This is question 3",
        "Question 3 - Answer 1", "Question 3 - Answer 2", "Question 3 - Answer Answer 3", "Question 3 - Answer Answer 4", 2);

        assert.equal("Quiz 1", await hrTest.quizs(0));
        assert.equal("This is question 1",  await hrTest.questions(0));
    });

    it('Submit answer', async () => {
        const tx1 = await hrTest.submitAnswer(0, 0, 2);
        assert.equal(0, tx1.logs[0].args.questionId.toNumber());
        assert.equal(true, tx1.logs[0].args.isCorrect);

        const tx2 = await hrTest.submitAnswer(0, 1, 2);
        assert.equal(1, tx2.logs[0].args.questionId.toNumber());
        assert.equal(true, tx2.logs[0].args.isCorrect);

        const tx3 = await hrTest.submitAnswer(0, 2, 1);
        assert.equal(2, tx3.logs[0].args.questionId.toNumber());
        assert.equal(false, tx3.logs[0].args.isCorrect);
        
        assert.equal(100*10**18, tx3.logs[1].args.reward.toNumber());
    });
})