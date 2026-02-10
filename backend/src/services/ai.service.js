const { OPENAI_API_KEY } = require("../config/env");

async function askAI(question) {
  if (!OPENAI_API_KEY) {
    throw new Error("AI API key not configured.");
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
          content: `Answer in exactly one word.\n\nQuestion: ${question}`,
        },
      ],
      max_tokens: 10,
      temperature: 0,
    }),
  });

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content
      ?.trim()
      ?.split(/\s+/)[0]
      ?.replace(/[^a-zA-Z0-9]/g, "") || "Unknown"
  );
}

module.exports = { askAI };
