const { getRandomNum } = require("../../utils/functions");

describe("Test the methos sort",()=>{

    test('Should get a number with a integer value', () => {
        expect(typeof getRandomNum(1,5)).toBe("number");
    });
})