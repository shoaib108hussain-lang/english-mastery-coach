/**
 * Web Speech API Engine (British English TTS & STT)
 * Handles Received Pronunciation (SSB / en-GB) audio output, speech recognition,
 * and interactive Speakometer Audio Player Bar state management.
 */

class SpeechEngine {
  constructor() {
    this.synth = window.speechSynthesis;
    this.britishVoice = null;
    this.recognition = null;
    this.isListening = false;
    this.activePlayerId = null;
    this.activeUtterance = null;
    this.playerSpeeds = {};
    this.playerTimers = {};
    this.initVoices();
    this.initRecognition();
  }

  initVoices() {
    if (!this.synth) return;
    
    const updateVoice = () => {
      const voices = this.synth.getVoices();
      // Search for British English voices
      this.britishVoice = voices.find(v => 
        v.lang === 'en-GB' || 
        v.lang === 'en_GB' || 
        v.name.includes('UK English') || 
        v.name.includes('British') || 
        v.name.includes('Hazel') || 
        v.name.includes('George')
      ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    };

    updateVoice();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoice;
    }
  }

  speak(text, options = {}) {
    if (!this.synth) {
      console.warn("Speech Synthesis not supported in this browser.");
      return;
    }

    this.synth.cancel(); // Stop ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    if (this.britishVoice) {
      utterance.voice = this.britishVoice;
    }
    utterance.lang = 'en-GB';
    utterance.rate = options.rate || 0.95; // Measured pacing for coaching
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    if (options.onstart) utterance.onstart = options.onstart;
    if (options.onend) utterance.onend = options.onend;
    if (options.onerror) utterance.onerror = options.onerror;

    this.synth.speak(utterance);
    return utterance;
  }

  /* --- Interactive Speakometer Audio Player Bar Methods --- */

  renderAudioPlayerBar(id, textToSpeak, defaultSpeed = 1.0) {
    if (!this.playerSpeeds[id]) {
      this.playerSpeeds[id] = defaultSpeed;
    }
    const speed = this.playerSpeeds[id];
    const safeText = textToSpeak.replace(/'/g, "\\'").replace(/"/g, '&quot;');

    return `
      <div class="audio-player-bar glass-box p-3 my-3" id="player_bar_${id}">
        <div class="player-controls-row">
          <button class="btn btn-primary btn-play-toggle" id="btn_play_${id}" onclick="speechEngine.togglePlayerBar('${id}', '${safeText}')">
            <span id="play_icon_${id}">▶</span> Play RP Reference
          </button>

          <div class="player-speed-toggle">
            <button class="btn-speed ${speed === 0.75 ? 'active' : ''}" id="speed_075_${id}" onclick="speechEngine.setPlayerSpeed('${id}', 0.75, '${safeText}')">
              0.75x Slow
            </button>
            <button class="btn-speed ${speed === 1.0 ? 'active' : ''}" id="speed_100_${id}" onclick="speechEngine.setPlayerSpeed('${id}', 1.0, '${safeText}')">
              1.0x Normal
            </button>
          </div>

          <div class="waveform-visualizer" id="wave_${id}">
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
            <span class="wave-bar"></span>
          </div>
        </div>

        <div class="player-progress-wrapper mt-3">
          <div class="progress-track" onclick="speechEngine.seekPlayerBar(event, '${id}')">
            <div class="progress-fill" id="fill_${id}" style="width: 0%;"></div>
          </div>
          <div class="player-time-display mt-1">
            <span id="time_cur_${id}">0:00</span> / <span id="time_dur_${id}">0:04</span>
          </div>
        </div>
      </div>
    `;
  }

  togglePlayerBar(id, text) {
    const playIcon = document.getElementById(`play_icon_${id}`);
    const waveBox = document.getElementById(`wave_${id}`);
    const fillBar = document.getElementById(`fill_${id}`);
    const timeCur = document.getElementById(`time_cur_${id}`);

    if (this.synth.speaking && this.activePlayerId === id) {
      // Pause/stop current playback
      this.synth.cancel();
      this.stopPlayerUI(id);
      return;
    }

    // Stop any previously playing player
    if (this.activePlayerId && this.activePlayerId !== id) {
      this.stopPlayerUI(this.activePlayerId);
      this.synth.cancel();
    }

    this.activePlayerId = id;
    const speed = this.playerSpeeds[id] || 1.0;
    let progressPct = 0;
    const estimatedDurationMs = Math.max(2000, text.length * (speed === 0.75 ? 120 : 80));

    if (playIcon) playIcon.textContent = '⏸';
    if (waveBox) waveBox.classList.add('waveform-active');

    let startTime = Date.now();
    if (this.playerTimers[id]) clearInterval(this.playerTimers[id]);

    this.playerTimers[id] = setInterval(() => {
      const elapsed = Date.now() - startTime;
      progressPct = Math.min(100, (elapsed / estimatedDurationMs) * 100);
      if (fillBar) fillBar.style.width = `${progressPct}%`;
      
      const sec = Math.floor(elapsed / 1000);
      if (timeCur) timeCur.textContent = `0:0${Math.min(4, sec)}`;

      if (progressPct >= 100) {
        clearInterval(this.playerTimers[id]);
      }
    }, 50);

    this.speak(text, {
      rate: speed * 0.9,
      onend: () => {
        this.stopPlayerUI(id);
      },
      onerror: () => {
        this.stopPlayerUI(id);
      }
    });
  }

  setPlayerSpeed(id, speed, text) {
    this.playerSpeeds[id] = speed;
    const btn075 = document.getElementById(`speed_075_${id}`);
    const btn100 = document.getElementById(`speed_100_${id}`);

    if (btn075) btn075.classList.toggle('active', speed === 0.75);
    if (btn100) btn100.classList.toggle('active', speed === 1.0);

    if (this.synth.speaking && this.activePlayerId === id) {
      this.synth.cancel();
      this.togglePlayerBar(id, text);
    }
  }

  stopPlayerUI(id) {
    const playIcon = document.getElementById(`play_icon_${id}`);
    const waveBox = document.getElementById(`wave_${id}`);
    const fillBar = document.getElementById(`fill_${id}`);
    const timeCur = document.getElementById(`time_cur_${id}`);

    if (playIcon) playIcon.textContent = '▶';
    if (waveBox) waveBox.classList.remove('waveform-active');
    if (fillBar) fillBar.style.width = '0%';
    if (timeCur) timeCur.textContent = '0:00';
    if (this.playerTimers[id]) clearInterval(this.playerTimers[id]);
    if (this.activePlayerId === id) this.activePlayerId = null;
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-GB';
  }

  startListening(onResult, onEnd, onError) {
    if (!this.recognition) {
      if (onError) onError("Speech Recognition API is not supported in your browser.");
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.isListening = true;

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (onResult) {
        onResult({
          final: finalTranscript,
          interim: interimTranscript,
          confidence: event.results[0] ? event.results[0][0].confidence : 0.9
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error(e);
      this.isListening = false;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

const speechEngine = new SpeechEngine();
