// generate.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const JWT_ROLE = process.env.JWT_ROLE || "admin";
const JWT_AUD = process.env.JWT_AUD || "postgraphile";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"; // bisa "1h", "7d", dst
const OUTPUT_FILE = process.env.JWT_OUTPUT_FILE || "jwt.txt";

// Payload untuk token
const payload = {
  role: JWT_ROLE,
  aud: JWT_AUD,
};

// Generate token
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: JWT_EXPIRES_IN,
});

console.log("✅ JWT token generated:\n");
console.log(token);

// Simpan ke file jwt.txt (opsional)
fs.writeFileSync(OUTPUT_FILE, token);
console.log(`\n💾 Token saved to ${OUTPUT_FILE}`);
