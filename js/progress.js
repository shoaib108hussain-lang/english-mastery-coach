/**
 * Progress Tracking & Spaced Repetition Manager
 * Tracks 8-Skill Mastery Metrics, Stage Completion (1-100), Streak, and Saved State
 */

const STORAGE_KEY = 'english_mastery_coach_profile_v1';

class ProgressManager {
  constructor() {
    this.profile = this.loadProfile();
  }

  getDefaultProfile() {
    return {
      currentStageId: 1, // Global Stage 1
      completedStages: [],
      diagnosticResult: null,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      skills: {
        grammar: 10,
        vocabulary: 10,
        speaking: 10,
        pronunciation: 10,
        listening: 10,
        reading: 10,
        writing: 10,
        communication: 10
      },
      reviewItems: [
        { term: "Subject + Verb order", stage: 1, nextReview: Date.now() },
        { term: "British /bɜːd/ vowel", stage: 1, nextReview: Date.now() }
      ]
    };
  }

  loadProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn("LocalStorage access error:", e);
    }
    return this.getDefaultProfile();
  }

  saveProfile() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  }

  setDiagnosticResult(result) {
    this.profile.diagnosticResult = result;
    this.profile.currentStageId = result.recommendedStageGlobal || 1;
    // Boost skills based on level
    const baseScore = result.score * 12 + 10;
    Object.keys(this.profile.skills).forEach(s => {
      this.profile.skills[s] = Math.min(95, baseScore + Math.floor(Math.random() * 8));
    });
    this.saveProfile();
  }

  completeStage(globalStageId) {
    if (!this.profile.completedStages.includes(globalStageId)) {
      this.profile.completedStages.push(globalStageId);
    }
    // Boost current stage if completing active stage
    if (this.profile.currentStageId === globalStageId && globalStageId < 100) {
      this.profile.currentStageId = globalStageId + 1;
    }
    // Increase all skills slightly
    Object.keys(this.profile.skills).forEach(s => {
      this.profile.skills[s] = Math.min(100, this.profile.skills[s] + 2);
    });
    this.saveProfile();
  }

  updateSkill(skillName, delta) {
    if (this.profile.skills[skillName] !== undefined) {
      this.profile.skills[skillName] = Math.max(0, Math.min(100, this.profile.skills[skillName] + delta));
      this.saveProfile();
    }
  }

  getStageStatus(globalStageId) {
    if (this.profile.completedStages.includes(globalStageId)) {
      return "completed";
    }
    if (this.profile.currentStageId === globalStageId) {
      return "current";
    }
    return "locked";
  }

  addReviewItem(term, stage) {
    this.profile.reviewItems.push({
      term,
      stage,
      nextReview: Date.now() + 86400000 // +1 day
    });
    this.saveProfile();
  }
}

const progressManager = new ProgressManager();
