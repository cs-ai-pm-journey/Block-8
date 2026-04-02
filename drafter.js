const OpenAI = require('openai');
require('dotenv').config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function draftResponse(ticketText, category, toneData) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `You are a customer support agent. Draft a response to this ticket.

Ticket: "${ticketText}"
Category: ${category}
Tone: ${toneData.tone} (${toneData.urgency} urgency)

Guidelines:
- Match the ${toneData.tone} tone
- Address the ${category} issue directly
- ${toneData.urgency === 'high' ? 'Show urgency and prioritize resolution' : 'Be thorough and helpful'}
- Keep response 2-3 sentences
- Be professional and empathetic

Draft response:`
    }],
    temperature: 0.7
  });
  
  const draftText = response.choices[0].message.content.trim();
  
  // Calculate confidence based on length and completeness
  const confidence = draftText.length > 50 && draftText.length < 500 ? 0.9 : 0.7;
  
  return {
    draft: draftText,
    confidence: confidence,
    category: category,
    tone: toneData.tone,
    urgency: toneData.urgency
  };
}

module.exports = { draftResponse };