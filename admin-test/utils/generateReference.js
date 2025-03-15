const Information = require("../models/information")

async function generateReference() {
  const currentYear = new Date().getFullYear().toString();
  const maxAttempts = 10;
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    let info = await Information.findOne({});

    // Create initial document if none exists
    if (!info) {
      const initialRef = `${currentYear}/0001`;
      await Information.create({ advanced: { lastVenteRef: initialRef } });
      return initialRef;
    }

    let lastRef = info.advanced?.lastVenteRef;
    let newRef;

    if (!lastRef) {
      // First reference ever
      newRef = `${currentYear}/0001`;
    } else {
      // Validate format
      if (!/^\d{4}\/\d{4}$/.test(lastRef)) {
        throw new Error("Invalid lastVenteRef format in database");
      }

      const [storedYear, sequenceStr] = lastRef.split('/');
      const sequence = parseInt(sequenceStr, 10);

      if (storedYear !== currentYear) {
        // New year, reset counter
        newRef = `${currentYear}/0001`;
      } else {
        // Increment sequence
        const newSequence = sequence + 1;
        if (newSequence > 9999) {
          throw new Error("Sequence number overflow");
        }
        newRef = `${currentYear}/${newSequence.toString().padStart(4, '0')}`;
      }
    }

    // Atomic update with retry
    const filter = lastRef 
      ? { _id: info._id, "advanced.lastVenteRef": lastRef }
      : { _id: info._id, "advanced.lastVenteRef": { $exists: false } };

    const updated = await Information.findOneAndUpdate(
      filter,
      { $set: { "advanced.lastVenteRef": newRef } },
      { new: true }
    );

    if (updated) {
      return newRef;
    }
  }

  throw new Error("Failed to generate reference after maximum retries");
}


module.exports = generateReference;
