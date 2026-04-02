const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function classifyTicket(ticketText) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `Classify this support ticket into ONE category and provide a confidence score (0.0-1.0).

Categories:
- Bug Report: System errors, crashes, broken features
- Feature Request: New capabilities, improvements
- Billing Issue: Payments, invoices, refunds
- Technical Support: How-to questions, configuration help
- General Inquiry: Questions, information requests

Ticket: "${ticketText}"

Return ONLY valid JSON:
{
  "category": "category name",
  "confidence": 0.95,
  "reasoning": "brief explanation"
}`
    }],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });
  
  return JSON.parse(response.choices[0].message.content);
}

module.exports = { classifyTicket };