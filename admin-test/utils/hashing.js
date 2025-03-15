const bcrypt = require("bcrypt");

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password to hash
 * @param {number} saltRounds - The cost factor (default: 10)
 * @returns {Promise<string>} - The hashed password
 */
const hash = async (password, saltRounds = 10) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password to check
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} - True if the password matches, false otherwise
 */
const compare = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error(`Error comparing passwords: ${error.message}`);
  }
};

module.exports = {
  hash,
  compare,
};
