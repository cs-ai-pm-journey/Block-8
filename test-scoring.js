const { processTicket } = require('./smart-reply-chain');
const testTickets = require('./test-tickets');
const fs = require('fs');

async function runManualScoring() {
  console.log('='.repeat(60));
  console.log('MANUAL QUALITY SCORING TEST');
  console.log('Testing 22 sample tickets');
  console.log('='.repeat(60));
  
  const results = [];
  let correctCategories = 0;
  let correctTones = 0;
  let totalConfidence = 0;
  
  for (const ticket of testTickets) {
    console.log(`\n--- Ticket ${ticket.id} ---`);
    
    const result = await processTicket(ticket.text);
    
    // Manual scoring
    const categoryCorrect = result.classification.category === ticket.expectedCategory;
    const toneCorrect = result.tone.type === ticket.expectedTone;
    
    if (categoryCorrect) correctCategories++;
    if (toneCorrect) correctTones++;
    totalConfidence += result.overallConfidence;
    
    const score = {
      ticketId: ticket.id,
      input: ticket.text.substring(0, 50) + '...',
      categoryCorrect,
      toneCorrect,
      confidence: result.overallConfidence.toFixed(2),
      draft: result.response.draft.substring(0, 60) + '...'
    };
    
    results.push(score);
    
    console.log(`✓ Category: ${categoryCorrect ? 'PASS' : 'FAIL'} (${result.classification.category})`);
    console.log(`✓ Tone: ${toneCorrect ? 'PASS' : 'FAIL'} (${result.tone.type})`);
    console.log(`✓ Confidence: ${result.overallConfidence.toFixed(2)}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`Category Accuracy: ${(correctCategories / testTickets.length * 100).toFixed(1)}% (${correctCategories}/${testTickets.length})`);
  console.log(`Tone Accuracy: ${(correctTones / testTickets.length * 100).toFixed(1)}% (${correctTones}/${testTickets.length})`);
  console.log(`Avg Confidence: ${(totalConfidence / testTickets.length).toFixed(2)}`);
  
  // Save to file
  fs.writeFileSync('scoring-results.json', JSON.stringify({
    totalTickets: testTickets.length,
    categoryAccuracy: correctCategories / testTickets.length,
    toneAccuracy: correctTones / testTickets.length,
    avgConfidence: totalConfidence / testTickets.length,
    results: results
  }, null, 2));
  
  console.log('\nResults saved to scoring-results.json');
}

runManualScoring().catch(console.error);