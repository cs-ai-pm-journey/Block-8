const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function calibrateTone(ticketText, category) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `Analyze the tone needed for this support ticket response.

Category: ${category}
Ticket: "${ticketText}"

Determine appropriate tone based on:
- Urgency (low/medium/high)
- Frustration level (calm/frustrated/angry)
- Complexity (simple/moderate/complex)

Return ONLY valid JSON:
{
  "tone": "empathetic" | "professional" | "technical" | "apologetic",
  "urgency": "low" | "medium" | "high",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}`
    }],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { calibrateTone };