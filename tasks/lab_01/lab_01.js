function sqrt(number, epsilon = 1e-10) {
    if (number < 0) {
        return NaN;
    } else if (number === 0) {
        return 0;
    }

    let guess = number / 2;
    let prevGuess;

    do {
        prevGuess = guess;
        guess = (guess + number / guess) / 2;
    } while (Math.abs(guess - prevGuess) > epsilon);

    return guess;
};

module.exports = sqrt;
