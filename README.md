# CS Smart Reply Copilot

AI-powered customer support assistant that routes tickets through a 3-step classification chain:
1. **Category Detection** - Classifies ticket type (Bug, Feature, Billing, Support, General)
2. **Tone Calibration** - Determines appropriate response tone and urgency
3. **Draft Response** - Generates contextual reply based on category and tone

## Features

- ✅ Multi-step prompt chaining (classification → calibration → generation)
- ✅ Confidence scoring at each step
- ✅ Overall confidence overlay (average across chain)
- ✅ Manual quality scoring on 22 test tickets
- ✅ Simple web interface for demo

## Quick Start
```bash
npm install
# Add OPENAI_API_KEY to .env file
npm start
# Open http://localhost:3000
```

## Running Quality Tests
```bash
npm test
# Processes 22 sample tickets and scores accuracy
# Results saved to scoring-results.json
```

## Architecture
```
Ticket Input
    ↓
[1] Category Detection (GPT-4)
    → Output: category + confidence + reasoning
    ↓
[2] Tone Calibration (GPT-4)
    → Output: tone type + urgency + confidence
    ↓
[3] Draft Response (GPT-4)
    → Output: draft text + confidence
    ↓
Final Output: Complete response with overall confidence score
```

## Test Results

- **22 test tickets** processed
- **Category accuracy:** ~91% (20/22 correct)
- **Tone accuracy:** ~86% (19/22 correct)
- **Avg confidence:** 0.87

## Tech Stack

- Node.js + Express
- OpenAI GPT-4 API
- Vanilla JavaScript frontend