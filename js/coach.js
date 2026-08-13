/**
 * Interactive AI Coach Dialogue Engine & Roleplay Scenarios
 * Supports British scenario presets, real-time grammar checks, and polite RP phrasing suggestions.
 */

const ROLEPLAY_SCENARIOS = {
  cafe: {
    title: "☕ Ordering at a London Cafe",
    intro: "Good morning! Welcome to The Royal Oak Cafe in Covent Garden. What can I get started for you today?",
    context: "Practice ordering tea, coffee, or pastries politely using Received Pronunciation."
  },
  interview: {
    title: "💼 Job Interview Prep",
    intro: "Good afternoon. Thank you for joining us today. Could you briefly introduce yourself and highlight your key professional background?",
    context: "Practice formal corporate interview responses, past accomplishments, and career goals."
  },
  hotel: {
    title: "🏨 Hotel Check-In & Requests",
    intro: "Welcome to The Grand Kensington Hotel. Do you have a reservation under your name, sir/madam?",
    context: "Practice hotel check-in procedures, requesting amenities, and polite queries."
  },
  directions: {
    title: "🧭 Asking Directions in London",
    intro: "Excuse me! I'm looking for the British Museum. Could you tell me the best way to get there from Holborn station?",
    context: "Practice spatial prepositions, directions, and public transport phrasing."
  }
};

class CoachChat {
  constructor() {
    this.activeScenario = null;
    this.messages = [
      {
        sender: "coach",
        text: "Hello! I am your **English Mastery Coach**. I am here to guide you from your baseline level all the way to B2 English fluency using our 13-Part 100-Stage curriculum. Select a British roleplay scenario below or start typing!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  }

  selectScenario(scenarioKey) {
    const sc = ROLEPLAY_SCENARIOS[scenarioKey];
    if (!sc) return;
    this.activeScenario = scenarioKey;

    this.messages.push({
      sender: "coach",
      text: `**${sc.title} Active**\n\n*${sc.intro}*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.renderMessages();
    speechEngine.speak(sc.intro.replace(/[*#]/g, ''), { rate: 0.9 });
  }

  renderMessages() {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const scenarioButtonsHTML = `
      <div class="scenario-presets-bar p-2 mb-3 glass-box border rounded d-flex flex-wrap gap-2">
        <span class="small fw-bold align-self-center me-2">🎭 Scenarios:</span>
        <button class="btn btn-sm btn-outline-light" onclick="coachChat.selectScenario('cafe')">☕ London Cafe</button>
        <button class="btn btn-sm btn-outline-light" onclick="coachChat.selectScenario('interview')">💼 Job Interview</button>
        <button class="btn btn-sm btn-outline-light" onclick="coachChat.selectScenario('hotel')">🏨 Hotel Check-In</button>
        <button class="btn btn-sm btn-outline-light" onclick="coachChat.selectScenario('directions')">🧭 Directions</button>
      </div>
    `;

    const msgsHTML = this.messages.map(msg => `
      <div class="chat-bubble-wrapper ${msg.sender === 'user' ? 'user-wrapper' : 'coach-wrapper'}">
        <div class="chat-avatar">${msg.sender === 'user' ? '👤' : '🇬🇧'}</div>
        <div class="chat-bubble ${msg.sender}">
          <div class="bubble-header">
            <span class="sender-name">${msg.sender === 'user' ? 'You' : 'English Mastery Coach'}</span>
            <span class="bubble-time">${msg.timestamp}</span>
            ${msg.sender === 'coach' ? `<button class="btn-icon ms-2" onclick="speechEngine.speak('${escapeHTML(msg.text.replace(/[*#]/g, ''))}')">🔊</button>` : ''}
          </div>
          <div class="bubble-content">${this.formatMarkdown(msg.text)}</div>
          ${msg.correctionHTML ? `<div class="bubble-correction mt-2">${msg.correctionHTML}</div>` : ''}
        </div>
      </div>
    `).join('');

    chatContainer.innerHTML = scenarioButtonsHTML + msgsHTML;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  formatMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHTML(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
    return formatted;
  }

  sendMessage(userText) {
    if (!userText || !userText.trim()) return;
    const input = document.getElementById('chat-input');
    if (input) input.value = '';

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({
      sender: "user",
      text: userText,
      timestamp
    });

    this.renderMessages();

    // Analyze user input for grammar/naturalness corrections
    const analysis = correctionEngine.analyze(userText);
    let correctionHTML = null;
    if (!analysis.isPerfect) {
      correctionHTML = correctionEngine.renderCorrectionHTML(analysis);
    }

    // Generate Coach Response
    setTimeout(() => {
      const coachResponse = this.generateResponse(userText, analysis);
      this.messages.push({
        sender: "coach",
        text: coachResponse,
        correctionHTML,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderMessages();
      speechEngine.speak(coachResponse.replace(/[*#]/g, ''), { rate: 0.95 });
    }, 600);
  }

  generateResponse(userText, analysis) {
    const lower = userText.toLowerCase();

    if (this.activeScenario === 'cafe') {
      return "Splendid choice! That will be £4.50. Would you care for a slice of Earl Grey cake or a scone with clotted cream to go with that?";
    }

    if (this.activeScenario === 'interview') {
      return "Thank you. That sounds like valuable experience. How do you handle high-pressure deadlines or competing priorities when managing projects?";
    }

    if (this.activeScenario === 'hotel') {
      return "Perfect! I have found your booking. Here is your room keycard for room 402 on the fourth floor. Breakfast is served from 7:00 to 10:30 AM in the dining hall.";
    }

    if (this.activeScenario === 'directions') {
      return "Certainly! Head straight past Holborn station onto High Holborn, turn left onto Museum Street, and walk for about three minutes. The main gates will be right in front of you!";
    }

    if (lower.includes('start') || lower.includes('diagnostic')) {
      return "Excellent! Let's begin the 10-Question Adaptive Diagnostic Assessment to determine your exact baseline level and assign your ideal starting stage. Please click the **Diagnostic Placement Test** tab above!";
    }

    if (!analysis.isPerfect) {
      return `Good effort! I have provided a quick structural correction card above. Notice how adjusting the phrasing makes your sentence sound much more natural in British English. Try creating another sentence applying that rule!`;
    }

    return `Spot on! Your sentence is grammatically accurate and reads very naturally in British English. Splendid work! What else would you like to practice?`;
  }
}

const coachChat = new CoachChat();
