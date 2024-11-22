const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Helper functions
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const validateBase64File = (fileB64) => {
  try {
    const decodedFile = Buffer.from(fileB64, "base64").toString("binary");
    const sizeInKB = Buffer.byteLength(fileB64, "base64") / 1024;
    return { valid: true, sizeKB: sizeInKB };
  } catch {
    return { valid: false };
  }
};

// POST Endpoint
app.post("/bfhl", (req, res) => {
  const { data, file_b64 } = req.body;

  // Extract user details
  const userId = "john_doe_17091999"; // Replace with dynamic user logic if needed
  const email = "john@xyz.com";
  const rollNumber = "ABCD123";

  // Separate numbers and alphabets
  const numbers = [];
  const alphabets = [];
  let highestLowercaseAlphabet = "";
  let isPrimeFound = false;

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
      if (isPrime(Number(item))) isPrimeFound = true;
    } else if (/^[a-zA-Z]$/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase() && item > highestLowercaseAlphabet) {
        highestLowercaseAlphabet = item;
      }
    }
  });

  // Validate file
  let fileValid = false;
  let fileMimeType = null;
  let fileSizeKB = null;

  if (file_b64) {
    const fileValidationResult = validateBase64File(file_b64);
    fileValid = fileValidationResult.valid;
    if (fileValid) {
      fileMimeType = "application/octet-stream"; // Replace with MIME type detection logic
      fileSizeKB = fileValidationResult.sizeKB.toFixed(2);
    }
  }

  // Response object
  const response = {
    is_success: true,
    user_id: userId,
    email,
    roll_number: rollNumber,
    numbers,
    alphabets,
    highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
    is_prime_found: isPrimeFound,
    file_valid: fileValid,
    file_mime_type: fileMimeType,
    file_size_kb: fileSizeKB,
  };

  res.status(200).json(response);
});

// GET Endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));