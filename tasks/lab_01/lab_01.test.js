const sqrt = require('./lab_01');

describe('Yahor Prykhodzka testowanie oprogramowania - lab_01: http://www.psw.na11.pl/testowanie-oprogramowania/', () => {
    const testCases = [
        {
            incomingNumber: 25,
            expected: 5,
            description: 'pierwiastek z liczby dodatniej',
        },
        {
            incomingNumber: -9,
            expected: NaN,
            description: 'pierwiastek z liczby ujemnej',
        },
        {
            incomingNumber: 0,
            expected: 0,
            description: 'pierwiastek z zera',
        },
        {
            incomingNumber: 4.41,
            expected: 2.1,
            description: 'pierwiastek z liczby dziesiętnej',
        },
        {
            incomingNumber: 100000000,
            expected: 10000,
            description: 'pierwiastek z dużej liczby',
        },
        {
            incomingNumber: 2,
            epsilon: 1e-6,
            expected: 1.414214,
            description: 'pierwiastek z zadaną precyzją',
        },
    ];
    testCases.forEach(({ incomingNumber, epsilon, expected, description }) => {
        it(`Poszukiwanie pierwiastka kwadratowego w przypadku gdzie ${description}`, () => {
            const result = epsilon ? sqrt(incomingNumber, epsilon) : sqrt(incomingNumber);
            if (isNaN(expected)) {
                expect(result).toEqual(expect.any(Number));
            } else {
                expect(result).toBeCloseTo(expected, 6);
            }
        });
    });
});
