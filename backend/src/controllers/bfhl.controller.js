const {
  generateFibonacci,
  filterPrimes,
  computeHCF,
  computeLCM,
} = require("../services/math.service");
const { askAI } = require("../services/ai.service");
const { successResponse } = require("../utils/response.util");
const { OFFICIAL_EMAIL } = require("../config/env");

function isValidIntegerArray(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((item) => Number.isInteger(item))
  );
}

/**
 * GET /health
 * Mandatory response structure
 */
exports.health = (_req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
};

/**
 * POST /bfhl
 */
exports.handleBFHL = async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid request body.",
      });
    }

    const keys = Object.keys(body);
    const validKeys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
    const matchedKeys = keys.filter((k) => validKeys.includes(k));

    if (matchedKeys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        message:
          "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI.",
      });
    }

    const key = matchedKeys[0];
    const value = body[key];

    switch (key) {
      case "fibonacci": {
        if (!Number.isInteger(value) || value < 1) {
          return res.status(400).json({
            is_success: false,
            message: "fibonacci requires a positive integer.",
          });
        }
        return res.status(200).json(successResponse(generateFibonacci(value)));
      }

      case "prime": {
        if (!isValidIntegerArray(value)) {
          return res.status(400).json({
            is_success: false,
            message: "prime requires a non-empty array of integers.",
          });
        }
        return res.status(200).json(successResponse(filterPrimes(value)));
      }

      case "lcm": {
        if (!isValidIntegerArray(value) || value.some((v) => v <= 0)) {
          return res.status(400).json({
            is_success: false,
            message: "lcm requires a non-empty array of positive integers.",
          });
        }
        return res.status(200).json(successResponse(computeLCM(value)));
      }

      case "hcf": {
        if (!isValidIntegerArray(value) || value.some((v) => v <= 0)) {
          return res.status(400).json({
            is_success: false,
            message: "hcf requires a non-empty array of positive integers.",
          });
        }
        return res.status(200).json(successResponse(computeHCF(value)));
      }

      case "AI": {
        if (typeof value !== "string" || value.trim().length === 0) {
          return res.status(400).json({
            is_success: false,
            message: "AI requires a non-empty string question.",
          });
        }
        const answer = await askAI(value.trim());
        return res.status(200).json(successResponse(answer));
      }

      default:
        return res.status(400).json({
          is_success: false,
          message: "Unsupported operation.",
        });
    }
  } catch (error) {
    console.error("POST /bfhl error:", error.message);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error.",
    });
  }
};
