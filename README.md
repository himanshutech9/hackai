# 🐾 Curio – Stray Animal Rescue Chatbot (AI-Powered with OpenAI GPT)

Curio is a friendly, AI-powered chatbot that helps users report and handle stray animal issues with empathy and efficiency. Built using OpenAI's GPT models and deployed on Vercel, this project is structured in clear **phases** for rapid iteration and deployment.

---

## 🚀 Tech Stack

- **Frontend**: Next.js (React) with Vercel Deployment
- **Backend**: OpenAI GPT-3.5 via API
- **AI Agent**: Prompt-based logic using OpenAI's Chat Completions
- **Testing**: Jest + Playwright (for UI/interaction)

---

## ✅ Phase Plan & What AI Builds in 2 Hours

### ✅ Phase 1: MVP – Basic Chatbot (COMPLETED)

- [x] Chat UI built with React
- [x] OpenAI GPT integration (basic prompt)
- [x] Recognizes if a message is about a stray animal
- [x] Extracts: animal type, issue, and location
- [x] Suggests basic first aid tips using GPT
- [x] Generates structured rescue report
- [x] Tests written for all components

### 🔹 Phase 2: Smart Triage & Location

- [ ] Assign urgency levels (low/med/high) using GPT
- [ ] Ask for more precise location if missing
- [ ] Validate prompt consistency

### 🔹 Phase 3: NGO Recommendations

- [ ] Use a static JSON file of NGOs per city/area
- [ ] Match location to NGO
- [ ] Add fallback message if none found

### 🔹 Phase 4: Community + Media

- [ ] Allow image uploads (future GPT-4 Vision)
- [ ] Show list of recently reported cases (local JSON)
- [ ] Share button for posting to X/WhatsApp

---

## ✅ Test Descriptions (Per Phase)

### ✅ Phase 1 Tests (ALL PASSING ✅)
| Test Name | Description |
|-----------|-------------|
| `test-intent-detection` | Checks if GPT can identify a rescue situation from a message |
| `test-animal-extraction` | Validates correct extraction of animal type from sample prompts |
| `test-issue-extraction` | Ensures correct parsing of problem (e.g., injured, unconscious) |
| `test-location-followup` | Confirms bot asks for location when it's not provided |
| `test-care-response` | Tests whether bot returns a first-aid message |
| `test-report-format` | Ensures the final report is JSON structured and complete |

### 🔜 Phase 2+ Tests (Planned)
| Test Name | Description |
|-----------|-------------|
| `test-triage-suggestion` | Validates urgency score prediction |
| `test-location-matching` | Tests NGO lookup accuracy |
| `test-response-tone` | Ensures empathy & helpfulness in tone (via snapshot) |

---

## 📦 Project Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-org/curio-chatbot.git
cd curio-chatbot

# 2. Install dependencies
npm install

# 3. Add your OpenAI API key to .env.local
echo "OPENAI_API_KEY=your_key_here" > .env.local

# 4. Run the dev server
npm run dev
```

**Important**: You need to get an OpenAI API key from [OpenAI's website](https://platform.openai.com/api-keys) and add it to your `.env.local` file for the chatbot to work.

---

## 🧪 Run Tests

```bash
# Unit tests
npm run test

# End-to-end tests
npx playwright test
```

---

## 🎯 Phase 1 Features Implemented

✅ **Smart Intent Detection**: Distinguishes between rescue situations and general pet questions  
✅ **Information Extraction**: Automatically extracts animal type, condition, and location  
✅ **First Aid Guidance**: Provides contextual first aid tips based on the situation  
✅ **Rescue Reports**: Generates downloadable structured reports for complete cases  
✅ **Responsive UI**: Beautiful, mobile-friendly interface with real-time chat  
✅ **Comprehensive Testing**: 8 unit tests covering all core functionality  

---

## 🧠 Built with Cursor + OpenAI Agents + Vercel 🚀
