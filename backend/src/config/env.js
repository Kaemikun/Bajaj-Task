require("dotenv").config();

const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL =
  process.env.OFFICIAL_EMAIL || "ansh2113.be23@chitkara.edu.in";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

if (process.env.NODE_ENV !== "production") {
  console.log("[env] OFFICIAL_EMAIL:", OFFICIAL_EMAIL ? "✓ set" : "✗ missing");
  console.log("[env] OPENAI_API_KEY:", OPENAI_API_KEY ? "✓ set" : "✗ missing");
}

module.exports = {
  PORT,
  OFFICIAL_EMAIL,
  OPENAI_API_KEY,
};
