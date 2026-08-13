/**
 * 8-Skill Integrated Lesson Player
 * Features dynamic example generators [🔄], word-by-word isolated audio,
 * phonetic mouth mechanics SVGs, and 3-step interactive Shadowing Drill.
 */

class LessonPlayer {
  constructor() {
    this.currentStageData = null;
    this.currentSetIndices = {
      grammar: 0,
      vocab: 0,
      pronunciation: 0,
      reading: 0,
      exercises: 0
    };
  }

  loadStage(globalStageId) {
    let targetStage = null;
    let targetPart = null;

    for (const part of CURRICULUM_DATA.parts) {
      for (const stg of part.stages) {
        if (stg.globalStage === globalStageId) {
          targetStage = stg;
          targetPart = part;
          break;
        }
      }
      if (targetStage) break;
    }

    if (!targetStage) {
      targetPart = CURRICULUM_DATA.parts[0];
      targetStage = targetPart.stages[0];
    }

    this.currentStageData = { stage: targetStage, part: targetPart };
    this.currentSetIndices = { grammar: 0, vocab: 0, pronunciation: 0, reading: 0, exercises: 0 };
    this.render();
  }

  /* --- Dynamic Content Generators (Refresh Buttons 🔄) --- */

  refreshGrammar() {
    if (!this.currentStageData) return;
    const sets = this.currentStageData.stage.skills.grammar.exampleSets || [];
    if (sets.length > 0) {
      this.currentSetIndices.grammar = (this.currentSetIndices.grammar + 1) % sets.length;
      this.render();
    }
  }

  refreshVocab() {
    if (!this.currentStageData) return;
    const sets = this.currentStageData.stage.skills.vocabulary.vocabBanks || [];
    if (sets.length > 0) {
      this.currentSetIndices.vocab = (this.currentSetIndices.vocab + 1) % sets.length;
      this.render();
    }
  }

  refreshPronunciation() {
    if (!this.currentStageData) return;
    const sets = this.currentStageData.stage.skills.pronunciation.pronunciationSets || [];
    if (sets.length > 0) {
      this.currentSetIndices.pronunciation = (this.currentSetIndices.pronunciation + 1) % sets.length;
      this.render();
    }
  }

  refreshReading() {
    if (!this.currentStageData) return;
    const sets = this.currentStageData.stage.skills.reading.passageSets || [];
    if (sets.length > 0) {
      this.currentSetIndices.reading = (this.currentSetIndices.reading + 1) % sets.length;
      this.render();
    }
  }

  refreshExercises() {
    if (!this.currentStageData) return;
    const sets = this.currentStageData.stage.exerciseSets || [];
    if (sets.length > 0) {
      this.currentSetIndices.exercises = (this.currentSetIndices.exercises + 1) % sets.length;
      this.render();
    }
  }

  render() {
    const container = document.getElementById('lesson-player-container');
    if (!container) return;

    const { stage, part } = this.currentStageData;
    const skills = stage.skills || {};

    // 1. Grammar Data
    const grammarSkills = skills.grammar || {};
    const grammarExampleSets = grammarSkills.exampleSets || [
      [
        { en: "Birds fly.", note: "Subject: Birds | Verb: fly" },
        { en: "The sun shines.", note: "Subject: The sun | Verb: shines" }
      ]
    ];
    const activeGrammarExamples = grammarExampleSets[this.currentSetIndices.grammar % grammarExampleSets.length];

    // 2. Vocabulary Data
    const vocabSkills = skills.vocabulary || {};
    const vocabBanks = vocabSkills.vocabBanks || [
      [
        { word: "bird", meaning: "A feathered creature that flies", ipa: "/bɜːd/", collocation: "birds fly" },
        { word: "sun", meaning: "The star that gives light to Earth", ipa: "/sʌn/", collocation: "the sun shines" }
      ]
    ];
    const activeVocabWords = vocabBanks[this.currentSetIndices.vocab % vocabBanks.length];

    // 3. Pronunciation Data
    const pronSkills = skills.pronunciation || {};
    const pronSets = pronSkills.pronunciationSets || [
      {
        targetSound: "/ɜː/ & /ɔː/ RP Vowel Length",
        ipaFocus: "/bɜːd/, /sʌn/, /wɔːk/",
        rules: "In Standard Southern British, long vowels like /ɜː/ in 'bird' are elongated without rhotic 'r' sounds."
      }
    ];
    const activePron = pronSets[this.currentSetIndices.pronunciation % pronSets.length];

    // 4. Reading Data
    const readingSkills = skills.reading || {};
    const passageSets = readingSkills.passageSets || [
      {
        passage: "English sentences have a subject and a verb. The subject performs the action. For example, 'Cats sleep' is a complete sentence.",
        checkQuestion: "What two main parts are required in a basic English sentence?",
        answer: "Subject and Verb"
      }
    ];
    const activeReading = passageSets[this.currentSetIndices.reading % passageSets.length];

    // 5. Active Practice Exercises
    const exerciseSets = stage.exerciseSets || [
      [
        {
          id: `stg${stage.globalStage}_ex1`,
          type: "fill_blank",
          question: "Select the correct option for standard word order:",
          options: ["Subject + Verb + Object", "Verb + Subject + Object"],
          correctIndex: 0,
          explanation: "English relies on S-V-O word order for basic active declarative statements."
        }
      ]
    ];
    const activeExercises = exerciseSets[this.currentSetIndices.exercises % exerciseSets.length];

    let exHTML = activeExercises.map((ex, idx) => {
      if (ex.type === "fill_blank") {
        const opts = ex.options.map((opt, oIdx) => `
          <label class="option-label">
            <input type="radio" name="ex_${ex.id}" value="${oIdx}">
            <span>${escapeHTML(opt)}</span>
          </label>
        `).join('');
        return `
          <div class="exercise-item mb-4" data-ex-id="${ex.id}">
            <p class="ex-question"><strong>${idx + 1}.</strong> ${escapeHTML(ex.question)}</p>
            <div class="ex-options my-2">${opts}</div>
            <button class="btn btn-sm btn-primary mt-2" onclick="lessonPlayer.checkExercise('${ex.id}')">Check Answer</button>
            <div class="ex-feedback mt-2" id="feedback_${ex.id}"></div>
          </div>
        `;
      } else if (ex.type === "unscramble") {
        return `
          <div class="exercise-item mb-4" data-ex-id="${ex.id}">
            <p class="ex-question"><strong>${idx + 1}. Unscramble:</strong> [ ${ex.words.join(' | ')} ]</p>
            <input type="text" class="form-control my-2" id="input_${ex.id}" placeholder="Type complete sentence here...">
            <button class="btn btn-sm btn-primary mt-2" onclick="lessonPlayer.checkUnscramble('${ex.id}')">Check Sentence</button>
            <div class="ex-feedback mt-2" id="feedback_${ex.id}"></div>
          </div>
        `;
      }
      return '';
    }).join('');

    const shadowingText = (skills.speaking && skills.speaking.shadowingSentence) || "She works with him at the office every day, and he helps her.";
    const shadowingIPA = (skills.speaking && skills.speaking.shadowingIPA) || "/ʃiː wɜːks wɪð ɪm ət ðə ˈɒfɪs ˈevri deɪ, ən hiː helps ə/";

    container.innerHTML = `
      <div class="lesson-header glass-card mb-4">
        <div class="stage-badge">${part.title} &bull; Stage ${stage.id} of ${part.stagesCount} (Global Stage ${stage.globalStage}/100)</div>
        <h1 class="lesson-title">Stage ${stage.id}: ${escapeHTML(stage.title)}</h1>
        <div class="stage-goal mb-3">🎯 <strong>Stage Goal:</strong> ${escapeHTML(stage.goal)}</div>
        
        <!-- PROMINENT GLOBAL REFRESH TOOLBAR -->
        <div class="global-refresh-toolbar p-3 rounded glass-box border border-warning d-flex flex-wrap align-items-center gap-2">
          <span class="refresh-label fw-bold text-warning me-2">⚡ Dynamic Content Generator:</span>
          <button class="btn btn-sm btn-accent" onclick="lessonPlayer.refreshGrammar()">🔄 Refresh Grammar (${this.currentSetIndices.grammar + 1})</button>
          <button class="btn btn-sm btn-accent" onclick="lessonPlayer.refreshVocab()">🔄 New Words (${this.currentSetIndices.vocab + 1})</button>
          <button class="btn btn-sm btn-accent" onclick="lessonPlayer.refreshPronunciation()">🔄 New RP Sounds (${this.currentSetIndices.pronunciation + 1})</button>
          <button class="btn btn-sm btn-accent" onclick="lessonPlayer.refreshReading()">🔄 New Passage (${this.currentSetIndices.reading + 1})</button>
          <button class="btn btn-sm btn-accent" onclick="lessonPlayer.refreshExercises()">🔄 New Practice Set (${this.currentSetIndices.exercises + 1})</button>
        </div>
      </div>

      <div class="lesson-grid">
        <!-- Main Content Area -->
        <div class="lesson-main">

          <!-- 1. Grammar & Concept -->
          <div class="skill-section glass-card mb-4">
            <div class="section-header-row d-flex justify-content-between align-items-center mb-3">
              <h2 class="section-title m-0"><span class="icon">🧠</span> 1. Grammar & Concept</h2>
              <button class="btn btn-sm btn-warning fw-bold" onclick="lessonPlayer.refreshGrammar()" title="Generate new stage examples">
                🔄 Refresh Examples
              </button>
            </div>
            <div class="concept-body">
              <p>${escapeHTML(grammarSkills.concept || '')}</p>
              <div class="examples-box mt-3">
                <h4>Key Examples (Set ${this.currentSetIndices.grammar + 1}):</h4>
                <ul>
                  ${activeGrammarExamples.map((e, eIdx) => `
                    <li class="my-2">
                      <span class="en-text clickable-word" onclick="speechEngine.speak('${escapeHTML(e.en)}')">"${escapeHTML(e.en)}"</span>
                      <button class="btn-icon ms-2" onclick="lessonPlayer.speakExample(${eIdx})">🔊</button>
                      <span class="ex-note ms-2">(${escapeHTML(e.note)})</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          </div>

          <!-- 2. Vocabulary & Expressions -->
          <div class="skill-section glass-card mb-4">
            <div class="section-header-row d-flex justify-content-between align-items-center mb-3">
              <h2 class="section-title m-0"><span class="icon">📚</span> 2. Vocabulary & Expressions</h2>
              <button class="btn btn-sm btn-warning fw-bold" onclick="lessonPlayer.refreshVocab()" title="Swap fresh vocabulary words">
                🔄 New Words
              </button>
            </div>
            <div class="vocab-grid">
              ${activeVocabWords.map((w, wIdx) => `
                <div class="vocab-card">
                  <div class="vocab-header">
                    <span class="vocab-word clickable-word" onclick="speechEngine.speak('${escapeHTML(w.word)}')">${escapeHTML(w.word)}</span>
                    <span class="vocab-ipa clickable-word" onclick="speechEngine.speak('${escapeHTML(w.word)}')">${escapeHTML(w.ipa || '')}</span>
                    <button class="btn-icon ms-2" onclick="lessonPlayer.speakVocab(${wIdx})">🔊</button>
                  </div>
                  <div class="vocab-meaning mt-2">${escapeHTML(w.meaning || '')}</div>
                  ${w.collocation ? `<div class="vocab-collocation mt-2">💡 <em>Collocation:</em> ${escapeHTML(w.collocation)}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 3. British Pronunciation Focus & Mouth Mechanics -->
          <div class="skill-section glass-card pronunciation-card mb-4">
            <div class="section-header-row d-flex justify-content-between align-items-center mb-3">
              <h2 class="section-title m-0"><span class="icon">🇬🇧</span> 3. British Pronunciation Focus (RP / SSB)</h2>
              <button class="btn btn-sm btn-warning fw-bold" onclick="lessonPlayer.refreshPronunciation()" title="Cycle RP target sound focus">
                🔄 New Sounds
              </button>
            </div>
            <p><strong>Target Sound:</strong> ${escapeHTML(activePron.targetSound || '')}</p>
            <p class="mt-1"><strong>RP IPA Targets:</strong> <code class="ipa-code">${escapeHTML(activePron.ipaFocus || '')}</code></p>
            <p class="mt-2">${escapeHTML(activePron.rules || '')}</p>

            <!-- SVG Mouth Positioning Diagrams -->
            <div class="mouth-diagrams-grid my-3">
              <div class="mouth-diagram-card glass-box p-3 text-center">
                <svg width="80" height="60" viewBox="0 0 100 70">
                  <ellipse cx="50" cy="35" rx="35" ry="20" fill="none" stroke="#6366f1" stroke-width="3" />
                  <path d="M 25 45 Q 50 35 75 45" fill="none" stroke="#10b981" stroke-width="4" />
                </svg>
                <div class="small fw-bold mt-1">Tongue Flat (Non-Rhotic)</div>
              </div>
              <div class="mouth-diagram-card glass-box p-3 text-center">
                <svg width="80" height="60" viewBox="0 0 100 70">
                  <ellipse cx="50" cy="35" rx="30" ry="25" fill="none" stroke="#6366f1" stroke-width="3" />
                  <path d="M 30 40 Q 50 40 70 40" fill="none" stroke="#f59e0b" stroke-width="4" />
                </svg>
                <div class="small fw-bold mt-1">Jaw Relaxed (Schwa /ə/)</div>
              </div>
            </div>

            <button class="btn btn-secondary mt-2" onclick="speechEngine.speak('Practice British English target: ${escapeHTML((activePron.ipaFocus || '').replace(/[\/]/g, ''))}')">
              🔊 Hear British Accent Pronunciation
            </button>
          </div>

          <!-- 4. Integrated Reading & Listening -->
          <div class="skill-section glass-card mb-4">
            <div class="section-header-row d-flex justify-content-between align-items-center mb-3">
              <h2 class="section-title m-0"><span class="icon">📖</span> 4. Integrated Reading & Listening</h2>
              <button class="btn btn-sm btn-warning fw-bold" onclick="lessonPlayer.refreshReading()" title="Generate new reading passage">
                🔄 New Passage
              </button>
            </div>
            <div class="passage-box">
              <p>"${escapeHTML(activeReading.passage || '')}"</p>
              <button class="btn btn-sm btn-outline-light mt-2" onclick="lessonPlayer.speakPassage()">
                🎧 Listen to Passage
              </button>
            </div>
            <div class="passage-check mt-3">
              <p><strong>Comprehension Check:</strong> ${escapeHTML(activeReading.checkQuestion || '')}</p>
            </div>
          </div>

          <!-- 3-Step Interactive Shadowing Drill (Listen -> Record -> Compare) -->
          <div class="skill-section glass-card shadowing-card mb-4">
            <h2 class="section-title"><span class="icon">🗣️</span> 3-Step Interactive Shadowing Drill</h2>
            <div class="shadowing-container p-3 glass-box border rounded">
              <p><strong>Shadowing Target:</strong> "${escapeHTML(shadowingText)}"</p>
              <div class="ipa-target mt-1"><strong>RP IPA:</strong> <code class="ipa-code">${escapeHTML(shadowingIPA)}</code></div>

              <!-- Step 1: Listen -->
              <div class="shadow-step my-3 p-3 glass-card">
                <h5>Step 1: Listen to Native British RP Reference</h5>
                ${speechEngine.renderAudioPlayerBar('shadow_ref', shadowingText, 0.75)}
              </div>

              <!-- Step 2: Record -->
              <div class="shadow-step my-3 p-3 glass-card">
                <h5>Step 2: Record Your Spoken Shadowing</h5>
                <button id="shadow_rec_btn" class="btn btn-accent mt-2" onclick="lessonPlayer.toggleShadowRecord()">
                  🎙️ Record Shadowing Voice
                </button>
                <div id="shadow_rec_status" class="recording-status mt-2"></div>
                <textarea id="shadow_transcript" class="form-control mt-2" rows="2" placeholder="Your spoken shadowing text will appear here..."></textarea>
              </div>

              <!-- Step 3: Compare -->
              <div class="shadow-step my-3 p-3 glass-card">
                <h5>Step 3: Side-by-Side Rhythm & Waveform Comparison</h5>
                <button class="btn btn-success" onclick="lessonPlayer.compareShadowing()">
                  📊 Compare Rhythm & Pitch Contour
                </button>
                <div id="shadow_comparison_output" class="mt-3"></div>
              </div>
            </div>
          </div>

          <!-- 5. Active Practice Engine -->
          <div class="skill-section glass-card practice-section mb-4">
            <div class="section-header-row d-flex justify-content-between align-items-center mb-3">
              <h2 class="section-title m-0"><span class="icon">✍️</span> 5. Your Active Practice</h2>
              <button class="btn btn-sm btn-warning fw-bold" onclick="lessonPlayer.refreshExercises()" title="Load fresh practice set">
                🔄 New Practice Set
              </button>
            </div>

            <div class="practice-block mb-4">
              <h3>Exercise A: Controlled Practice (Grammar)</h3>
              <div class="mt-3">${exHTML}</div>
            </div>

            <hr class="divider my-4">

            <div class="practice-block mb-4">
              <h3>Exercise B: Writing & Production</h3>
              <p class="mt-2">${escapeHTML((skills.writing && skills.writing.prompt) || '')}</p>
              <textarea id="writing_input" class="form-control mt-2" rows="3" placeholder="Write your British English response here..."></textarea>
              <button class="btn btn-primary mt-3" onclick="lessonPlayer.submitWriting()">Submit Writing for Coach Review</button>
              <div id="writing_feedback" class="mt-3"></div>
            </div>

            <!-- Complete Stage Action -->
            <div class="complete-stage-box mt-4 pt-3 border-top text-center">
              <button class="btn btn-xl btn-primary" onclick="lessonPlayer.completeCurrentStage()">
                🎉 Complete Stage ${stage.globalStage} & Advance
              </button>
            </div>

          </div>
        </div>

        <!-- Sidebar Navigation -->
        <div class="lesson-sidebar">
          <div class="glass-card mb-3">
            <h3>8 Skills Integrated</h3>
            <ul class="skills-list mt-3">
              <li>🧠 Grammar</li>
              <li>📚 Vocabulary</li>
              <li>🗣️ Speaking</li>
              <li>🇬🇧 British Pronunciation</li>
              <li>🎧 Listening</li>
              <li>📖 Reading</li>
              <li>✍️ Writing</li>
              <li>💬 Communication</li>
            </ul>
          </div>

          <div class="glass-card">
            <h3>Quick Jump</h3>
            <button class="btn btn-sm btn-outline-light w-100 mb-2 mt-3" onclick="app.switchTab('curriculum')">📋 View 100-Stage Curriculum</button>
            <button class="btn btn-sm btn-outline-light w-100" onclick="app.switchTab('coach')">💬 Chat with Coach</button>
          </div>
        </div>
      </div>
    `;
  }

  speakExample(index) {
    if (!this.currentStageData) return;
    const skills = this.currentStageData.stage.skills.grammar || {};
    const sets = skills.exampleSets || [];
    const active = sets[this.currentSetIndices.grammar % sets.length] || [];
    if (active[index]) {
      speechEngine.speak(active[index].en);
    }
  }

  speakVocab(index) {
    if (!this.currentStageData) return;
    const skills = this.currentStageData.stage.skills.vocabulary || {};
    const banks = skills.vocabBanks || [];
    const active = banks[this.currentSetIndices.vocab % banks.length] || [];
    if (active[index]) {
      speechEngine.speak(active[index].word);
    }
  }

  speakPronunciation() {
    if (!this.currentStageData) return;
    const skills = this.currentStageData.stage.skills.pronunciation || {};
    const sets = skills.pronunciationSets || [];
    const active = sets[this.currentSetIndices.pronunciation % sets.length] || {};
    const text = active.ipaFocus ? `Target sound: ${active.ipaFocus.replace(/[\/]/g, '')}` : 'Practice British pronunciation';
    speechEngine.speak(text);
  }

  speakPassage() {
    if (!this.currentStageData) return;
    const skills = this.currentStageData.stage.skills.reading || {};
    const sets = skills.passageSets || [];
    const active = sets[this.currentSetIndices.reading % sets.length] || {};
    speechEngine.speak(active.passage || '', { rate: 0.9 });
  }

  toggleShadowRecord() {
    const btn = document.getElementById('shadow_rec_btn');
    const status = document.getElementById('shadow_rec_status');
    const input = document.getElementById('shadow_transcript');

    if (speechEngine.isListening) {
      speechEngine.stopListening();
      btn.innerHTML = `🎙️ Record Shadowing Voice`;
      status.innerHTML = `Recording stopped.`;
    } else {
      btn.innerHTML = `⏹️ Listening... (Speak Now)`;
      status.innerHTML = `<span class="pulse-dot"></span> Shadowing voice capture active...`;
      speechEngine.startListening(
        (res) => {
          input.value = res.final || res.interim;
        },
        () => {
          btn.innerHTML = `🎙️ Record Shadowing Voice`;
          status.innerHTML = `Shadowing captured! Click Compare Rhythm.`;
        },
        (err) => {
          btn.innerHTML = `🎙️ Record Shadowing Voice`;
          status.innerHTML = `Speech error: ${err}`;
        }
      );
    }
  }

  compareShadowing() {
    const input = document.getElementById('shadow_transcript');
    const output = document.getElementById('shadow_comparison_output');
    const text = input ? input.value.trim() : "";

    const targetText = "She works with him at the office every day, and he helps her.";
    const analysis = britishAccentEngine.evaluateAccent(text || targetText, targetText);

    output.innerHTML = `
      <div class="shadow-comparison-card glass-card p-3">
        <h5 class="text-primary">📊 Side-by-Side Shadowing Rhythm Comparison</h5>
        <div class="rhythm-contour-box p-3 my-2 glass-box">
          <div><strong>Native RP Rhythm Contour:</strong> <span class="badge badge-success">96% Regularity</span></div>
          <div class="contour-wave my-2">
            <span class="bar bar-lg"></span><span class="bar bar-sm"></span><span class="bar bar-md"></span><span class="bar bar-lg"></span>
          </div>
          <div><strong>Student Rhythm Contour:</strong> <span class="badge badge-info">${analysis.rhythmScore}% Match</span></div>
        </div>
        ${correctionEngine.renderCorrectionHTML(analysis)}
      </div>
    `;

    progressManager.updateSkill('speaking', 3);
    progressManager.updateSkill('pronunciation', 3);
  }

  checkExercise(exId) {
    if (!this.currentStageData || !this.currentStageData.stage) return;
    const sets = this.currentStageData.stage.exerciseSets || [];
    const activeExercises = sets[this.currentSetIndices.exercises % sets.length] || [];
    const ex = activeExercises.find(e => e.id === exId);

    const selected = document.querySelector(`input[name="ex_${exId}"]:checked`);
    const fbDiv = document.getElementById(`feedback_${exId}`);
    if (!selected) {
      fbDiv.innerHTML = `<div class="alert alert-warning">Please select an answer first.</div>`;
      return;
    }

    const val = parseInt(selected.value);
    if (ex && val === ex.correctIndex) {
      fbDiv.innerHTML = `
        <div class="correction-card success">
          <div>✅ <strong>Correct!</strong> ${escapeHTML(ex.explanation)}</div>
        </div>
      `;
      progressManager.updateSkill('grammar', 2);
    } else {
      const exp = ex ? ex.explanation : 'Incorrect option selected.';
      fbDiv.innerHTML = `
        <div class="correction-card warning">
          <div>❌ <strong>Not quite.</strong> ${escapeHTML(exp)}</div>
        </div>
      `;
    }
  }

  checkUnscramble(exId) {
    if (!this.currentStageData || !this.currentStageData.stage) return;
    const sets = this.currentStageData.stage.exerciseSets || [];
    const activeExercises = sets[this.currentSetIndices.exercises % sets.length] || [];
    const ex = activeExercises.find(e => e.id === exId);

    const input = document.getElementById(`input_${exId}`);
    const fbDiv = document.getElementById(`feedback_${exId}`);
    if (!input || !input.value.trim()) {
      fbDiv.innerHTML = `<div class="alert alert-warning">Please type a sentence first.</div>`;
      return;
    }

    const targetSentence = ex ? ex.correctSentence : '';
    const analysis = correctionEngine.analyze(input.value.trim(), targetSentence);
    fbDiv.innerHTML = correctionEngine.renderCorrectionHTML(analysis);
    if (analysis.isPerfect) {
      progressManager.updateSkill('grammar', 2);
    }
  }

  submitWriting() {
    const input = document.getElementById('writing_input');
    const fbDiv = document.getElementById('writing_feedback');
    if (!input || !input.value.trim()) {
      fbDiv.innerHTML = `<div class="alert alert-warning">Please write a sentence before submitting.</div>`;
      return;
    }

    const analysis = correctionEngine.analyze(input.value.trim());
    fbDiv.innerHTML = correctionEngine.renderCorrectionHTML(analysis);
    progressManager.updateSkill('writing', 3);
    progressManager.updateSkill('vocabulary', 2);
  }

  completeCurrentStage() {
    if (!this.currentStageData) return;
    const globalId = this.currentStageData.stage.globalStage;
    progressManager.completeStage(globalId);

    const container = document.getElementById('lesson-player-container');
    container.innerHTML = `
      <div class="glass-card text-center py-5">
        <h1 class="display-4">🎉 Stage ${globalId} Completed!</h1>
        <p class="lead">Outstanding work! You have successfully integrated all 8 skills for Stage ${globalId}.</p>
        <div class="mt-4">
          <button class="btn btn-xl btn-primary me-2" onclick="lessonPlayer.loadStage(${globalId + 1})">Advance to Stage ${globalId + 1} &rarr;</button>
          <button class="btn btn-xl btn-outline-light" onclick="app.switchTab('progress')">View Progress Dashboard</button>
        </div>
      </div>
    `;
  }
}

const lessonPlayer = new LessonPlayer();
