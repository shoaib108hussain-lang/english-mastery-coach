/**
 * Main Application Coordinator (English Mastery Coach SPA)
 * Includes 60-second Daily Challenge Mini-Game, SVG Skill Radar Chart,
 * and global stage header state synchronization.
 */

class App {
  constructor() {
    this.activeTab = 'lesson';
    this.dailyChallengeTimer = null;
    this.dailyChallengeTimeLeft = 60;
    this.dailyChallengeIndex = 0;
    this.dailyChallengeScore = 0;
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.updateHeaderStats();
      this.bindNav();
      this.renderCurrentTab();
    });
  }

  getActiveStageData() {
    if (!progressManager) return null;
    const globalId = progressManager.profile.currentStageId || 1;
    let targetStage = null;
    let targetPart = null;

    for (const part of CURRICULUM_DATA.parts) {
      for (const stg of part.stages) {
        if (stg.globalStage === globalId) {
          targetStage = stg;
          targetPart = part;
          break;
        }
      }
      if (targetStage) break;
    }

    return { stage: targetStage || CURRICULUM_DATA.parts[0].stages[0], part: targetPart || CURRICULUM_DATA.parts[0] };
  }

  updateHeaderStats() {
    const stageBadge = document.getElementById('stat-current-stage');
    const levelBadge = document.getElementById('stat-level');
    const streakBadge = document.getElementById('stat-streak');
    const avgSkillBadge = document.getElementById('stat-avg-skill');

    if (!progressManager) return;
    const p = progressManager.profile;

    const data = this.getActiveStageData();
    const stage = data ? data.stage : null;
    const part = data ? data.part : null;

    if (stageBadge) {
      stageBadge.textContent = `Stage ${p.currentStageId}/100`;
    }

    if (levelBadge) {
      if (part && stage) {
        levelBadge.textContent = `${part.level} • Stage ${stage.id}`;
      } else if (p.diagnosticResult && p.diagnosticResult.level) {
        levelBadge.textContent = p.diagnosticResult.level;
      } else {
        levelBadge.textContent = `A1 Baseline`;
      }
    }

    if (streakBadge) {
      streakBadge.textContent = `🔥 ${p.streakDays} Day Streak`;
    }

    if (avgSkillBadge) {
      const skills = Object.values(p.skills);
      const avg = Math.round(skills.reduce((a, b) => a + b, 0) / skills.length);
      avgSkillBadge.textContent = `Mastery: ${avg}%`;
    }
  }

  bindNav() {
    const navItems = document.querySelectorAll('.nav-link[data-tab], .mobile-nav-item[data-tab]');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const tab = item.getAttribute('data-tab');
        if (tab) {
          this.switchTab(tab);
        }
      });
    });
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    document.querySelectorAll('.nav-link[data-tab], .mobile-nav-item[data-tab]').forEach(el => {
      if (el.getAttribute('data-tab') === tabName) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-content').forEach(el => {
      if (el.id === `tab-${tabName}`) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    this.renderCurrentTab();
    this.updateHeaderStats();
  }

  renderCurrentTab() {
    if (this.activeTab === 'lesson') {
      lessonPlayer.loadStage(progressManager.profile.currentStageId);
    } else if (this.activeTab === 'accent') {
      this.renderAccentTrainer();
    } else if (this.activeTab === 'curriculum') {
      this.renderCurriculum();
    } else if (this.activeTab === 'diagnostic') {
      this.renderDiagnostic();
    } else if (this.activeTab === 'coach') {
      coachChat.renderMessages();
    } else if (this.activeTab === 'progress') {
      this.renderProgressDashboard();
    }
  }

  /* --- 60-Second Daily Challenge Mini-Game --- */

  startDailyChallenge() {
    this.dailyChallengeTimeLeft = 60;
    this.dailyChallengeIndex = 0;
    this.dailyChallengeScore = 0;

    const questions = [
      { q: "Birds _______ high in the sky.", opts: ["fly", "flies", "flying"], correct: 0 },
      { q: "Which word has a silent 'r' in RP British English?", opts: ["work", "red", "run"], correct: 0 },
      { q: "She _______ to the office every morning.", opts: ["travels", "travel", "travelling"], correct: 0 },
      { q: "What is the weak Schwa form of 'to'?", opts: ["/tə/", "/tuː/", "/tɒ/"], correct: 0 },
      { q: "Choose correct order: She _______ books.", opts: ["reads", "reading", "readed"], correct: 0 }
    ];

    this.dailyChallengeQuestions = questions;
    this.renderChallengeStep();

    if (this.dailyChallengeTimer) clearInterval(this.dailyChallengeTimer);

    this.dailyChallengeTimer = setInterval(() => {
      this.dailyChallengeTimeLeft--;
      const timeElem = document.getElementById('dc_time');
      if (timeElem) timeElem.textContent = `${this.dailyChallengeTimeLeft}s`;

      if (this.dailyChallengeTimeLeft <= 0) {
        clearInterval(this.dailyChallengeTimer);
        this.finishDailyChallenge();
      }
    }, 1000);
  }

  renderChallengeStep() {
    const box = document.getElementById('daily-challenge-game-box');
    if (!box) return;

    if (this.dailyChallengeIndex >= this.dailyChallengeQuestions.length) {
      clearInterval(this.dailyChallengeTimer);
      this.finishDailyChallenge();
      return;
    }

    const q = this.dailyChallengeQuestions[this.dailyChallengeIndex];
    const optsHTML = q.opts.map((opt, idx) => `
      <button class="btn btn-outline-light w-100 my-1 text-start" onclick="app.answerChallenge(${idx})">
        ${String.fromCharCode(65 + idx)}. ${escapeHTML(opt)}
      </button>
    `).join('');

    box.innerHTML = `
      <div class="glass-card p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="badge badge-warning">⚡ Rapid Fire ${this.dailyChallengeIndex + 1}/5</span>
          <span class="badge badge-danger" id="dc_time">⏱️ ${this.dailyChallengeTimeLeft}s</span>
        </div>
        <h4>${escapeHTML(q.q)}</h4>
        <div class="mt-3">${optsHTML}</div>
      </div>
    `;
  }

  answerChallenge(idx) {
    const q = this.dailyChallengeQuestions[this.dailyChallengeIndex];
    if (idx === q.correct) {
      this.dailyChallengeScore += 50;
    }
    this.dailyChallengeIndex++;
    this.renderChallengeStep();
  }

  finishDailyChallenge() {
    const box = document.getElementById('daily-challenge-game-box');
    if (!box) return;

    progressManager.profile.streakDays += 1;
    progressManager.saveProfile();
    this.updateHeaderStats();

    box.innerHTML = `
      <div class="glass-card text-center p-4">
        <h2>🎉 Daily Challenge Completed!</h2>
        <div class="display-4 text-warning my-3">+${this.dailyChallengeScore} XP</div>
        <p class="lead">Streak updated to <strong>🔥 ${progressManager.profile.streakDays} Days</strong>!</p>
        <button class="btn btn-primary mt-2" onclick="app.startDailyChallenge()">Play Again 🔄</button>
      </div>
    `;
  }

  renderAccentTrainer() {
    const container = document.getElementById('accent-trainer-container');
    if (!container) return;

    const data = this.getActiveStageData();
    const stage = data.stage;
    const part = data.part;

    const targetText = "She works with him at the office every day, and he helps her.";
    const targetIPA = "/ʃiː wɜːks wɪð ɪm ət ðə ˈɒfɪs ˈevri deɪ, ən hiː helps ə/";

    container.innerHTML = `
      <div class="accent-trainer-header glass-card mb-4">
        <div class="stage-badge">${part.title} &bull; Stage ${stage.id}: ${escapeHTML(stage.title)} (Global Stage ${stage.globalStage}/100)</div>
        <h1 class="lesson-title">🎙️ Speakometer-Style British Accent Trainer</h1>
        <p class="lead">Dedicated RP / SSB Phonetic Analysis, Non-Rhoticity Check, Schwa Weak Forms, and Syllable Stress Evaluation.</p>
      </div>

      <div class="glass-card mb-4">
        <h2 class="section-title"><span class="icon">🎯</span> Target Sentence to Read Aloud:</h2>
        <div class="target-sentence-box p-3 my-3">
          <h3 class="text-primary mb-2">"${escapeHTML(targetText)}"</h3>
          <div class="ipa-target mt-2">
            <strong>RP IPA Standard:</strong> <code class="ipa-code">${escapeHTML(targetIPA)}</code>
          </div>
        </div>

        <div class="rp-rules-summary p-3 mb-3 border rounded">
          <h4>🇬🇧 Core British Phonetic Rules for this Sentence:</h4>
          <ul class="mt-2">
            <li><strong>Silent 'R' (Non-Rhoticity):</strong> Do <em>not</em> pronounce the 'r' in <code>works</code> (/wɜːks/). Lengthen the vowel instead.</li>
            <li><strong>Weak Forms & Schwa (/ə/):</strong> Drop 'h' and reduce <code>him</code> (/ɪm/) and <code>her</code> (/ə/). Reduce <code>at</code> (/ət/) and <code>and</code> (/ən/).</li>
            <li><strong>Primary Syllable Stress:</strong> Stress falls on <strong>OFF</strong>-ice /ˈɒf.ɪs/ and <strong>EV</strong>-ery /ˈev.ri/.</li>
          </ul>

          <div class="mt-3">
            ${speechEngine.renderAudioPlayerBar('accent_page_ref', targetText, 0.75)}
          </div>
        </div>

        <div class="speaking-recorder-box p-3 border rounded">
          <h4>🎙️ Record Your Spoken Audio:</h4>
          <div class="speaking-controls mt-3">
            <button id="accent_record_btn" class="btn btn-accent me-2" onclick="app.toggleAccentRecord()">
              🎙️ Start Voice Recording (Speech Recognition)
            </button>
            <span id="accent_status" class="recording-status"></span>
          </div>
          <textarea id="accent_spoken_input" class="form-control mt-3" rows="2" placeholder="Your spoken text will appear here. Or type your spoken phrase to test evaluation..."></textarea>
          <button class="btn btn-primary mt-3" onclick="app.evaluateAccentSubmission()">
            ⚡ Run Speakometer British Accent Analysis
          </button>
        </div>
      </div>

      <div id="speakometer-analysis-output">
        <!-- Speakometer Report rendered here -->
      </div>
    `;

    const defaultAnalysis = britishAccentEngine.evaluateAccent(
      targetText,
      targetText,
      targetIPA
    );
    document.getElementById('speakometer-analysis-output').innerHTML = britishAccentEngine.renderAnalysisHTML(defaultAnalysis);
  }

  toggleAccentRecord() {
    const btn = document.getElementById('accent_record_btn');
    const status = document.getElementById('accent_status');
    const input = document.getElementById('accent_spoken_input');

    if (speechEngine.isListening) {
      speechEngine.stopListening();
      btn.innerHTML = `🎙️ Start Voice Recording`;
      status.innerHTML = `Recording stopped.`;
    } else {
      btn.innerHTML = `⏹️ Listening... (Speak Now)`;
      status.innerHTML = `<span class="pulse-dot"></span> Recording British English speech...`;
      speechEngine.startListening(
        (res) => {
          input.value = res.final || res.interim;
        },
        () => {
          btn.innerHTML = `🎙️ Start Voice Recording`;
          status.innerHTML = `Speech captured! Click Run Speakometer Analysis.`;
        },
        (err) => {
          btn.innerHTML = `🎙️ Start Voice Recording`;
          status.innerHTML = `Speech error: ${err}`;
        }
      );
    }
  }

  evaluateAccentSubmission() {
    const input = document.getElementById('accent_spoken_input');
    const output = document.getElementById('speakometer-analysis-output');
    const spokenText = input ? input.value.trim() : "";

    const targetText = "She works with him at the office every day, and he helps her.";
    const targetIPA = "/ʃiː wɜːks wɪð ɪm ət ðə ˈɒfɪs ˈevri deɪ, ən hiː helps ə/";

    const textToEvaluate = spokenText || targetText;
    const analysis = britishAccentEngine.evaluateAccent(
      textToEvaluate,
      targetText,
      targetIPA
    );

    output.innerHTML = britishAccentEngine.renderAnalysisHTML(analysis);
    progressManager.updateSkill('pronunciation', 4);
    progressManager.updateSkill('speaking', 3);
    this.updateHeaderStats();
  }

  renderCurriculum() {
    const container = document.getElementById('curriculum-roadmap-container');
    if (!container) return;

    let partsHTML = CURRICULUM_DATA.parts.map(part => {
      let stagesHTML = part.stages.map(stg => {
        const status = progressManager.getStageStatus(stg.globalStage);
        let badgeClass = "badge-secondary";
        let statusLabel = "Not Started";

        if (status === 'completed') {
          badgeClass = "badge-success";
          statusLabel = "✅ Completed";
        } else if (status === 'current') {
          badgeClass = "badge-warning";
          statusLabel = "🚀 Current Stage";
        }

        return `
          <div class="curriculum-stage-card ${status}" onclick="app.jumpToStage(${stg.globalStage})">
            <div class="stg-header">
              <span class="stg-number">Global Stage ${stg.globalStage}</span>
              <span class="badge ${badgeClass}">${statusLabel}</span>
            </div>
            <h4 class="stg-title">Stage ${stg.id}: ${escapeHTML(stg.title)}</h4>
            <p class="stg-goal">${escapeHTML(stg.goal)}</p>
            <button class="btn btn-sm btn-outline-primary mt-2">Open Stage ${stg.globalStage} Lesson</button>
          </div>
        `;
      }).join('');

      return `
        <div class="curriculum-part-section glass-card mb-4">
          <div class="part-header">
            <h2>${escapeHTML(part.title)}</h2>
            <span class="part-meta">${part.stagesCount} Stages &bull; Level Target: ${part.level}</span>
          </div>
          <p class="part-desc">${escapeHTML(part.description)}</p>
          <div class="curriculum-stages-grid mt-3">
            ${stagesHTML}
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="roadmap-header text-center mb-4">
        <h1>13-Part &bull; 100-Stage Curriculum Roadmap</h1>
        <p class="lead">Systematic Start &rarr; B2 English Mastery Progression</p>
      </div>
      ${partsHTML}
    `;
  }

  jumpToStage(globalStageId) {
    progressManager.profile.currentStageId = globalStageId;
    progressManager.saveProfile();
    this.updateHeaderStats();
    this.switchTab('lesson');
  }

  renderDiagnostic() {
    const container = document.getElementById('diagnostic-quiz-container');
    if (!container) return;

    if (diagnosticEngine.currentStep >= DIAGNOSTIC_QUESTIONS.length) {
      // Show results
      const res = diagnosticEngine.evaluate();
      progressManager.setDiagnosticResult(res);
      this.updateHeaderStats();

      container.innerHTML = `
        <div class="glass-card text-center py-5">
          <h1 class="display-4">🎯 Diagnostic Assessment Complete!</h1>
          <div class="diagnostic-level-badge my-3">Assigned Baseline: ${res.level}</div>
          <p class="lead max-w-600 mx-auto">${res.summaryText}</p>
          
          <div class="diagnostic-score-box my-4">
            <div class="score-num">${res.score} / ${res.total}</div>
            <div class="score-label">Overall Diagnostic Index</div>
          </div>

          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-xl btn-primary" onclick="app.jumpToStage(${res.recommendedStageGlobal})">
              🚀 Begin Recommended Stage ${res.recommendedStageGlobal}
            </button>
            <button class="btn btn-xl btn-outline-light" onclick="diagnosticEngine.reset(); app.renderDiagnostic();">
              🔄 Retake Assessment
            </button>
          </div>
        </div>
      `;
      return;
    }

    const q = DIAGNOSTIC_QUESTIONS[diagnosticEngine.currentStep];

    if (q.type === 'text_input') {
      container.innerHTML = `
        <div class="glass-card max-w-700 mx-auto">
          <div class="step-indicator">Question ${diagnosticEngine.currentStep + 1} of ${DIAGNOSTIC_QUESTIONS.length} &bull; ${q.title}</div>
          <h2 class="q-title mt-3">${escapeHTML(q.prompt)}</h2>
          <textarea id="diag_text_input" class="form-control mt-3" rows="4" placeholder="Type your response..."></textarea>
          <button class="btn btn-primary btn-lg mt-3 w-100" onclick="app.submitDiagText()">Next Question &rarr;</button>
        </div>
      `;
    } else {
      const opts = q.options.map((opt, idx) => `
        <div class="diag-option-card" onclick="app.submitDiagOption(${idx})">
          <span class="option-num">${String.fromCharCode(65 + idx)}</span>
          <span class="option-text">${escapeHTML(opt)}</span>
        </div>
      `).join('');

      container.innerHTML = `
        <div class="glass-card max-w-700 mx-auto">
          <div class="step-indicator">Question ${diagnosticEngine.currentStep + 1} of ${DIAGNOSTIC_QUESTIONS.length} &bull; ${q.title}</div>
          ${q.passage ? `<div class="passage-box my-3">"${escapeHTML(q.passage)}"</div>` : ''}
          <h2 class="q-title mt-3">${escapeHTML(q.question)}</h2>
          <div class="diag-options-grid mt-4">
            ${opts}
          </div>
        </div>
      `;
    }
  }

  submitDiagOption(optIndex) {
    diagnosticEngine.saveAnswer(diagnosticEngine.currentStep, optIndex);
    diagnosticEngine.currentStep++;
    this.renderDiagnostic();
  }

  submitDiagText() {
    const input = document.getElementById('diag_text_input');
    const val = input ? input.value : '';
    diagnosticEngine.saveAnswer(diagnosticEngine.currentStep, val);
    diagnosticEngine.currentStep++;
    this.renderDiagnostic();
  }

  renderProgressDashboard() {
    const container = document.getElementById('progress-dashboard-container');
    if (!container) return;

    const p = progressManager.profile;
    const skills = p.skills;

    // SVG Skill Radar Chart Generation
    const skillKeys = Object.keys(skills);
    const radarSVG = this.generateRadarSVG(skills);

    const skillCards = skillKeys.map(sKey => {
      const score = skills[sKey];
      const title = sKey.charAt(0).toUpperCase() + sKey.slice(1);
      return `
        <div class="skill-meter-card glass-card">
          <div class="skill-header d-flex justify-content-between">
            <span class="skill-name fw-bold">${title}</span>
            <span class="skill-val text-primary fw-bold">${score}%</span>
          </div>
          <div class="progress-bar-track mt-2">
            <div class="progress-bar-fill" style="width: ${score}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="dashboard-header mb-4">
        <h1>📊 Learning Analytics & 8-Skill Mastery Dashboard</h1>
        <p class="lead">Real-time metrics tracking your progress towards B2 Fluency.</p>
      </div>

      <!-- 60-Second Daily Challenge Widget -->
      <div class="glass-card mb-4 border border-warning" id="daily-challenge-game-box">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h3>🔥 60-Second Daily Challenge Mini-Game</h3>
            <p class="text-muted mb-0">Test 5 rapid-fire questions to earn +250 XP and extend your learning streak!</p>
          </div>
          <button class="btn btn-warning btn-lg" onclick="app.startDailyChallenge()">
            ⚡ Start 60s Challenge
          </button>
        </div>
      </div>

      <div class="stats-overview-grid mb-4">
        <div class="stat-card glass-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-value">${p.currentStageId} / 100</div>
          <div class="stat-label">Active Global Stage</div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-value">${p.completedStages.length}</div>
          <div class="stat-label">Completed Stages</div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-value">${p.streakDays} Days</div>
          <div class="stat-label">Learning Streak</div>
        </div>

        <div class="stat-card glass-card">
          <div class="stat-icon">🌟</div>
          <div class="stat-value">${p.diagnosticResult ? p.diagnosticResult.level : 'A1 Baseline'}</div>
          <div class="stat-label">Proficiency Level</div>
        </div>
      </div>

      <!-- SVG Skill Radar Chart -->
      <div class="glass-card mb-5 text-center">
        <h2>🕸️ 8-Skill Mastery Radar Chart</h2>
        <div class="radar-chart-wrapper my-3 d-flex justify-content-center">
          ${radarSVG}
        </div>
      </div>

      <h2 class="mb-3">8 Core Integrated Skills Breakdown</h2>
      <div class="skills-meters-grid mb-5">
        ${skillCards}
      </div>

      <h2 class="mb-3">Spaced Repetition Review Queue</h2>
      <div class="glass-card">
        ${p.reviewItems && p.reviewItems.length > 0 ? `
          <ul class="review-list list-unstyled m-0">
            ${p.reviewItems.map(item => `
              <li class="review-item p-3 glass-box mb-2 d-flex align-items-center">
                <span class="review-term">📖 ${escapeHTML(item.term)}</span>
                <span class="badge badge-info ms-2">From Stage ${item.stage}</span>
                <button class="btn btn-sm btn-outline-primary ms-auto" onclick="speechEngine.speak('${escapeHTML(item.term)}')">🔊 Review Pronunciation</button>
              </li>
            `).join('')}
          </ul>
        ` : `<p>No review items queued today. Splendid job!</p>`}
      </div>
    `;
  }

  generateRadarSVG(skills) {
    const keys = Object.keys(skills);
    const numPoints = keys.length;
    const center = 150;
    const radius = 100;

    let points = [];
    keys.forEach((key, idx) => {
      const angle = (Math.PI * 2 / numPoints) * idx - Math.PI / 2;
      const scoreRatio = (skills[key] || 10) / 100;
      const r = radius * scoreRatio;
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      points.push(`${x},${y}`);
    });

    const polygonPoints = points.join(' ');

    return `
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <circle cx="150" cy="150" r="75" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <circle cx="150" cy="150" r="50" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
        <circle cx="150" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1" />

        <polygon points="${polygonPoints}" fill="rgba(99, 102, 241, 0.4)" stroke="#6366f1" stroke-width="3" />
      </svg>
    `;
  }
}

const app = new App();
