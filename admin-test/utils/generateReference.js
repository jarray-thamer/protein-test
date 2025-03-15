const vente = require("../models/vente");

async function generateReference() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 5;

  async function generateRandomString() {
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }

  let isUnique = false;
  let newReference;

  while (!isUnique) {
    // Generate a random 5-character string
    newReference = await generateRandomString();

    // Check if this reference already exists
    const existingVente = await vente.findOne({ reference: newReference });

    if (!existingVente) {
      isUnique = true;
    }
  }

  return newReference;
}

module.exports = generateReference;
