/**
 * 10-Question Adaptive Diagnostic Placement Test
 * Evaluates Grammar, Vocabulary, Reading, Listening, Communication & British Pronunciation
 */

const DIAGNOSTIC_QUESTIONS = [
  {
    part: 1,
    title: "1. Grammar: Mixed Conditionals",
    question: "If we _______ the project deadline last month, we wouldn't be facing this crisis today.",
    options: ["didn't miss", "hadn't missed", "haven't missed", "wouldn't miss"],
    correct: 1,
    skill: "Grammar"
  },
  {
    part: 2,
    title: "2. Grammar: Indirect Questions",
    question: "Choose the grammatically correct British English sentence:",
    options: [
      "She asked me where was the British library.",
      "She asked me where the British library was.",
      "She asked me where is the British library.",
      "She asked me that where the British library was."
    ],
    correct: 1,
    skill: "Grammar"
  },
  {
    part: 3,
    title: "3. Tense Contrast: Present Perfect vs Past Simple",
    question: "I _______ in London for five years before I moved to Manchester in 2022.",
    options: ["have lived", "lived", "was living", "have been living"],
    correct: 1,
    skill: "Grammar"
  },
  {
    part: 4,
    title: "4. Reading & Contextual Inference",
    passage: "Although remote working offers unprecedented flexibility, critics argue that it subtly erodes spontaneous collaboration and company cohesion over time.",
    question: "What is the main concern expressed by critics of remote working?",
    options: [
      "It reduces technical efficiency.",
      "It harms natural, unplanned teamwork and company unity.",
      "It increases commuting costs.",
      "It requires too much supervision."
    ],
    correct: 1,
    skill: "Reading"
  },
  {
    part: 5,
    title: "5. Vocabulary & Collocations",
    question: "Which verb collocate is most natural in standard British English?",
    options: [
      "to do a decision",
      "to make a decision",
      "to create a decision",
      "to build a decision"
    ],
    correct: 1,
    skill: "Vocabulary"
  },
  {
    part: 6,
    title: "6. Relative Clauses",
    question: "The proposal _______ was presented yesterday was approved unanimously.",
    options: ["who", "which", "whose", "where"],
    correct: 1,
    skill: "Grammar"
  },
  {
    part: 7,
    title: "7. Passive Voice & Formal Register",
    question: "The new environmental policy _______ by Parliament next week.",
    options: ["will debate", "will be debated", "is debating", "has debated"],
    correct: 1,
    skill: "Grammar"
  },
  {
    part: 8,
    title: "8. Communication & Pragmatics",
    question: "Which expression is the most natural British English phrase for polite disagreement in a formal meeting?",
    options: [
      "You are completely wrong about this.",
      "I see your point, but I'm inclined to look at it slightly differently.",
      "I reject your argument entirely.",
      "That makes no sense to me."
    ],
    correct: 1,
    skill: "Communication"
  },
  {
    part: 9,
    title: "9. British Pronunciation Awareness",
    question: "In Standard Southern British (RP/SSB) English, which word contains a silent 'r' (non-rhotic pronunciation)?",
    options: ["red /red/", "car /kɑː/", "rain /reɪn/", "run /rʌn/"],
    correct: 1,
    skill: "Pronunciation"
  },
  {
    part: 10,
    title: "10. Writing Production & Argumentation",
    prompt: "Write 2-3 sentences explaining why continuous learning is important for personal career growth.",
    type: "text_input",
    skill: "Writing"
  }
];

class DiagnosticEngine {
  constructor() {
    this.answers = {};
    this.currentStep = 0;
  }

  reset() {
    this.answers = {};
    this.currentStep = 0;
  }

  saveAnswer(stepIndex, answer) {
    this.answers[stepIndex] = answer;
  }

  evaluate() {
    let score = 0;
    let maxScore = 9; // 9 objective items + 1 writing text
    let breakdown = { grammar: 0, reading: 0, vocabulary: 0, communication: 0, pronunciation: 0, writing: 1 };

    for (let i = 0; i < 9; i++) {
      if (this.answers[i] === DIAGNOSTIC_QUESTIONS[i].correct) {
        score++;
        const sk = DIAGNOSTIC_QUESTIONS[i].skill.toLowerCase();
        if (breakdown[sk] !== undefined) breakdown[sk]++;
      }
    }

    const writingText = (this.answers[9] || '').trim();
    if (writingText.length > 35) {
      score++;
      breakdown.writing = 2;
    }

    let level = "A1 (Foundations)";
    let recommendedPartId = 1;
    let recommendedStageGlobal = 1;
    let summaryText = "";

    if (score <= 2) {
      level = "A1 (Foundations)";
      recommendedPartId = 1;
      recommendedStageGlobal = 1;
      summaryText = "You have a basic foundation. We recommend starting from Part 1 Stage 1 to build solid grammar and sentence structures step-by-step.";
    } else if (score <= 4) {
      level = "A2 (Elementary / Core Patterns)";
      recommendedPartId = 2;
      recommendedStageGlobal = 9;
      summaryText = "You understand simple sentences well! We recommend starting at Part 2: Core Sentence Patterns to strengthen your structural control.";
    } else if (score <= 7) {
      level = "B1 (Intermediate Tenses & Clauses)";
      recommendedPartId = 5;
      recommendedStageGlobal = 31;
      summaryText = "Solid intermediate skills! You are ready for Part 5: Tenses & Aspect contrasts to refine your narrative fluency.";
    } else {
      level = "B1+ / B2 (Upper-Intermediate Mastery)";
      recommendedPartId = 12;
      recommendedStageGlobal = 83;
      summaryText = "Impressive background! You demonstrate strong awareness of complex structures. We recommend starting at Part 12: B2 Grammar & Communication.";
    }

    return {
      score,
      total: 10,
      level,
      recommendedPartId,
      recommendedStageGlobal,
      summaryText,
      breakdown,
      writingSample: writingText
    };
  }
}

const diagnosticEngine = new DiagnosticEngine();
