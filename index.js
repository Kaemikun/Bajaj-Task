require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL =
  process.env.OFFICIAL_EMAIL || "japit0612.be23@chitkara.edu.in";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

// Log env load (mask API key)
if (process.env.NODE_ENV !== "production") {
  console.log("[env] OFFICIAL_EMAIL:", OFFICIAL_EMAIL ? "✓ set" : "✗ missing");
  console.log("[env] OPENAI_API_KEY:", OPENAI_API_KEY ? "✓ set" : "✗ missing");
}

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    is_success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(limiter);

app.use((err, _req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid JSON payload." });
  }
  next(err);
});

function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const series = [0, 1];
  for (let i = 2; i < n; i++) {
    series.push(series[i - 1] + series[i - 2]);
  }
  return series;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function filterPrimes(arr) {
  return arr.filter(isPrime);
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / gcd(a, b);
}

function computeHCF(arr) {
  return arr.reduce((acc, val) => gcd(acc, val));
}

function computeLCM(arr) {
  return arr.reduce((acc, val) => lcm(acc, val));
}

async function askAI(question) {
  if (!OPENAI_API_KEY) {
    throw new Error("AI API key not configured (OPENAI_API_KEY).");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Answer the following question in exactly one word. No punctuation, no explanation, just one word.\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    let errMsg = "AI service request failed.";
    try {
      const parsed = JSON.parse(errBody);
      const detail = parsed?.error?.message || errBody.slice(0, 200);
      errMsg = `AI service request failed: ${detail}`;
    } catch (_) {
      errMsg = `AI service request failed: ${response.status} ${response.statusText}`;
    }
    console.error("[OpenAI]", response.status, errBody.slice(0, 500));
    throw new Error(errMsg);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim() || "";
  return text.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, "") || "Unknown";
}

function isValidIntegerArray(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((item) => Number.isInteger(item))
  );
}

function successResponse(data) {
  return {
    is_success: true,
    official_email: OFFICIAL_EMAIL,
    data,
  };
}

app.get("/health", (_req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res
        .status(400)
        .json({ is_success: false, message: "Invalid request body." });
    }

    const keys = Object.keys(body);
    const validKeys = ["fibonacci", "prime", "lcm", "hcf", "AI"];
    const matchedKeys = keys.filter((k) => validKeys.includes(k));

    if (matchedKeys.length === 0) {
      return res.status(400).json({
        is_success: false,
        message:
          "Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI.",
      });
    }

    if (matchedKeys.length > 1) {
      return res.status(400).json({
        is_success: false,
        message: "Request must contain exactly one functional key.",
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
        if (value.length > 500) {
          return res.status(400).json({
            is_success: false,
            message: "AI question must not exceed 500 characters.",
          });
        }
        const answer = await askAI(value.trim());
        return res.status(200).json(successResponse(answer));
      }

      default:
        return res
          .status(400)
          .json({ is_success: false, message: "Unsupported key." });
    }
  } catch (error) {
    console.error("POST /bfhl error:", error.message);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error.",
    });
  }
});

app.use((_req, res) => {
  res.status(404).json({ is_success: false, message: "Route not found." });
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err.message);
  res
    .status(500)
    .json({ is_success: false, message: "Internal server error." });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
