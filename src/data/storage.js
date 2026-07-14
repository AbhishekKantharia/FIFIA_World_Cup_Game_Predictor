const STORAGE_KEY = 'fifa2026_predictor';

class Storage {
  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
      return null;
    }
  }

  static clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }

  static saveHighScore(score, name) {
    const data = this.load() || {};
    const highScore = data.highScore || 0;
    if (score > highScore) {
      data.highScore = score;
    }
    const leaderboard = data.leaderboard || [];
    leaderboard.push({ name, score, date: new Date().toISOString() });
    leaderboard.sort((a, b) => b.score - a.score);
    data.leaderboard = leaderboard.slice(0, 50);
    this.save(data);
    return data;
  }

  static getHighScore() {
    const data = this.load();
    return data?.highScore || 0;
  }

  static getLeaderboard() {
    const data = this.load();
    return data?.leaderboard || [];
  }

  static saveGameState(state) {
    const data = this.load() || {};
    data.activeGame = state;
    this.save(data);
  }

  static getGameState() {
    const data = this.load();
    return data?.activeGame || null;
  }

  static clearGameState() {
    const data = this.load();
    if (data) {
      delete data.activeGame;
      this.save(data);
    }
  }
}
