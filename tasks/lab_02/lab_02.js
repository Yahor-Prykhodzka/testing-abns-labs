function validatePesel(pesel) {
    // Check if PESEL is a string of 11 digits
    if (!/^\d{11}$/.test(pesel)) {
      return false;
    }
  
    // Extract individual digits from the PESEL
    const digits = pesel.split('').map(Number);
  
    // Validate month and day
    const month = parseInt(pesel.substring(2, 4), 10);
    const day = parseInt(pesel.substring(4, 6), 10);
  
    if (month > 12 || day > 31) {
      return false;
    }
  
    // Calculate checksum
    const weights = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
    const checksum = digits.reduce((sum, digit, index) => sum + digit * weights[index], 0) % 10;
  
    if (checksum === 0) {
      return digits[10] === 0;
    } else {
      return digits[10] === 10 - checksum;
    }
  }

module.exports = validatePesel;