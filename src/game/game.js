class Game {
  constructor() {
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctPredictions = 0;
    this.currentMatchIndex = 0;
    this.isGameOver = false;
    this.matches = [];
    this.playerName = '';
  }

  init(playerName) {
    this.playerName = playerName;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.correctPredictions = 0;
    this.currentMatchIndex = 0;
    this.isGameOver = false;
    this.matches = this._shuffle(DataStore.getCompletedMatches());
    return this;
  }

  restore(state) {
    if (!state) return false;
    this.score = state.score || 0;
    this.streak = state.streak || 0;
    this.bestStreak = state.bestStreak || 0;
    this.correctPredictions = state.correctPredictions || 0;
    this.currentMatchIndex = state.currentMatchIndex || 0;
    this.isGameOver = state.isGameOver || false;
    this.playerName = state.playerName || '';
    this.matches = state.matches || [];
    if (this.matches.length === 0) {
      this.matches = this._shuffle(DataStore.getCompletedMatches());
    }
    return !this.isGameOver && this.currentMatchIndex < this.matches.length;
  }

  getCurrentMatch() {
    if (this.isGameOver || this.currentMatchIndex >= this.matches.length) {
      return null;
    }
    return this.matches[this.currentMatchIndex];
  }

  predict(teamCode) {
    const match = this.getCurrentMatch();
    if (!match) return null;

    const isCorrect = match.winner === teamCode;

    if (isCorrect) {
      this.score += 10 + (this.streak * 2);
      this.streak++;
      if (this.streak > this.bestStreak) this.bestStreak = this.streak;
      this.correctPredictions++;
    } else {
      this.isGameOver = true;
    }

    const result = {
      match,
      prediction: teamCode,
      correct: isCorrect,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      correctPredictions: this.correctPredictions,
      isGameOver: this.isGameOver
    };

    if (!this.isGameOver) {
      this.currentMatchIndex++;
    }

    return result;
  }

  getState() {
    return {
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      correctPredictions: this.correctPredictions,
      currentMatchIndex: this.currentMatchIndex,
      isGameOver: this.isGameOver,
      matches: this.matches,
      playerName: this.playerName
    };
  }

  totalMatches() {
    return this.matches.length;
  }

  isDraw(match) {
    return match.winner === null;
  }

  _shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
