const { classifyTicket } = require('./classifier');
const { calibrateTone } = require('./tone-calibrator');
const { draftResponse } = require('./drafter');

async function processTicket(ticketText) {
  console.log('\n=== PROCESSING TICKET ===');
  console.log('Input:', ticketText);
  
  // Step 1: Classify
  console.log('\n[1/3] Classifying ticket...');
  const classification = await classifyTicket(ticketText);
  console.log('Category:', classification.category, `(confidence: ${classification.confidence})`);
  
  // Step 2: Calibrate tone
  console.log('\n[2/3] Calibrating tone...');
  const toneData = await calibrateTone(ticketText, classification.category);
  console.log('Tone:', toneData.tone, `| Urgency: ${toneData.urgency}`);
  
  // Step 3: Draft response
  console.log('\n[3/3] Drafting response...');
  const result = await draftResponse(ticketText, classification.category, toneData);
  
  // Combine all metadata
  return {
    input: ticketText,
    classification: {
      category: classification.category,
      confidence: classification.confidence,
      reasoning: classification.reasoning
    },
    tone: {
      type: toneData.tone,
      urgency: toneData.urgency,
      confidence: toneData.confidence
    },
    response: {
      draft: result.draft,
      confidence: result.confidence
    },
    overallConfidence: (classification.confidence + toneData.confidence + result.confidence) / 3
  };
}

module.exports = { processTicket };