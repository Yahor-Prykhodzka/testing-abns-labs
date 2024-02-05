let validatePesel = require('./lab_02');

describe('validatePesel function', () => {
    const testCases = [
        {
            pesel: '1234567890',
            expected: false,
            description:
                'Invalid PESEL with incorrect length should return false',
        },
        {
            pesel: '12a45678901',
            expected: false,
            description:
                'Invalid PESEL with non-numeric characters should return false',
        },
        {
            pesel: '12351378901',
            expected: false,
            description:
                'Invalid PESEL with month greater than 12 should return false',
        },
        {
            pesel: '12345678991',
            expected: false,
            description:
                'Invalid PESEL with day greater than 31 should return false',
        },
        {
            pesel: '12345678900',
            expected: false,
            description:
                'Invalid PESEL with incorrect checksum should return false',
        },
        {
            pesel: '00000000000',
            expected: false,
            description: 'Invalid PESEL with all zeros should return false',
        },
        {
            pesel: '99022812345',
            expected: false,
            description: 'Invalid PESEL with a future date should return false',
        },
        {
            pesel: '99022912345',
            expected: false,
            description:
                'Invalid PESEL with a non-leap year date should return false',
        },
    ];

    testCases.forEach(({ pesel, expected, description }) => {
        test(description, () => {
            expect(validatePesel(pesel)).toBe(expected);
        });
    });
});
