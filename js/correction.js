/**
 * Systematic Correction Framework
 * Analyzes student input and formats strict, clear feedback adhering to the prompt rules:
 * ❌ User Sentence
 * ✅ Corrected British Version
 * 💡 Explanation (Rule & Natural usage hint)
 */

class CorrectionEngine {
  constructor() {
    this.commonPatterns = [
      {
        pattern: /i have went/i,
        replacement: "I have gone",
        category: "Grammar Error",
        explanation: "Use past participle 'gone' (not past simple 'went') with auxiliary 'have'."
      },
      {
        pattern: /she don't/i,
        replacement: "she doesn't",
        category: "Grammar Error",
        explanation: "Third-person singular 'she' requires auxiliary 'doesn't' in present simple negative."
      },
      {
        pattern: /he do a goal/i,
        replacement: "he achieved a goal",
        category: "Naturalness / Collocation",
        explanation: "In natural British English, we say 'achieve a goal' or 'reach a goal' rather than 'do a goal'."
      },
      {
        pattern: /discuss about/i,
        replacement: "discuss",
        category: "Grammar Error",
        explanation: "'Discuss' is a transitive verb that takes a direct object without the preposition 'about'."
      },
      {
        pattern: /i am agree/i,
        replacement: "I agree",
        category: "Grammar Error",
        explanation: "'Agree' is a verb itself, so we say 'I agree' rather than 'I am agree'."
      },
      {
        pattern: /more better/i,
        replacement: "much better",
        category: "Grammar Error",
        explanation: "Avoid double comparative. Use 'much better' or simply 'better'."
      }
    ];
  }

  analyze(userText, targetText = null) {
    let correctedText = userText;
    let issues = [];

    // Run rule-based pattern checking
    for (const rule of this.commonPatterns) {
      if (rule.pattern.test(userText)) {
        correctedText = correctedText.replace(rule.pattern, rule.replacement);
        issues.push({
          category: rule.category,
          explanation: rule.explanation
        });
      }
    }

    // Capitalization & basic punctuation check
    if (correctedText.length > 0 && /^[a-z]/.test(correctedText)) {
      correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1);
      if (!issues.some(i => i.explanation.includes('Capitalize'))) {
        issues.push({
          category: "Punctuation / Style",
          explanation: "Sentences must start with a capital letter."
        });
      }
    }

    if (correctedText.length > 0 && !/[.!?]$/.test(correctedText)) {
      correctedText += ".";
      if (!issues.some(i => i.explanation.includes('period'))) {
        issues.push({
          category: "Punctuation / Style",
          explanation: "Complete English sentences end with a full stop (period), question mark, or exclamation mark."
        });
      }
    }

    const isPerfect = issues.length === 0 && (targetText ? userText.trim().toLowerCase() === targetText.trim().toLowerCase() : true);

    return {
      original: userText,
      corrected: isPerfect ? userText : (targetText || correctedText),
      isPerfect,
      issues: isPerfect ? [] : (issues.length > 0 ? issues : [{
        category: "Naturalness Improvement",
        explanation: "In Standard British English, we refine word choice and syntax to match native speaker cadences."
      }])
    };
  }

  renderCorrectionHTML(analysis) {
    if (analysis.isPerfect) {
      return `
        <div class="correction-card success">
          <div class="correction-header"><span class="icon">✨</span> Excellent Production!</div>
          <div class="corrected-text">✅ ${escapeHTML(analysis.original)}</div>
          <p class="explanation">Grammatically accurate, natural British phrasing.</p>
        </div>
      `;
    }

    const explanationsHTML = analysis.issues.map(issue => `
      <div class="explanation-item">
        <span class="badge ${issue.category.includes('Grammar') ? 'badge-danger' : 'badge-warning'}">${issue.category}</span>
        <span>${escapeHTML(issue.explanation)}</span>
      </div>
    `).join('');

    return `
      <div class="correction-card warning">
        <div class="correction-item user-sentence">
          <span class="label">❌ Student Output:</span>
          <span class="text">${escapeHTML(analysis.original)}</span>
        </div>
        <div class="correction-item british-sentence">
          <span class="label">✅ Corrected British Version:</span>
          <span class="text">${escapeHTML(analysis.corrected)}</span>
        </div>
        <div class="correction-explanation">
          <div class="exp-title">💡 Coach Feedback & Structural Rules:</div>
          ${explanationsHTML}
        </div>
      </div>
    `;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const correctionEngine = new CorrectionEngine();
