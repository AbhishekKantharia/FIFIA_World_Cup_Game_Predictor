class App {
  constructor() {
    this.game = null;
    this.ui = new UI();
    this.dataStore = new DataStore();
    this._init();
  }

  async _init() {
    try {
      await this.dataStore.load();
    } catch (e) {
      console.error('Failed to load data:', e);
      this.ui.showError(`Could not load World Cup data from the API. Please check your internet connection and refresh. (${e.message})`);
      return;
    }

    try {
      const saved = Storage.getGameState();
      this.game = new Game(this.dataStore);

      if (saved && this.game.restore(saved)) {
        this.ui.init(this.game, this.dataStore);
        this._loadMatch();
      } else {
        Storage.clearGameState();
        this.game = new Game(this.dataStore);
        this.ui.init(this.game, this.dataStore);
        this.ui.showStartScreen(Storage.getHighScore());
      }

      this._bindEvents();
    } catch (e) {
      console.error('Initialization error:', e);
      const ui = new UI();
      ui.showError('Failed to initialize the game. Please refresh.');
    }
  }

  _bindEvents() {
    const startBtn = document.getElementById('start-btn');
    const leaderboardBtn = document.getElementById('leaderboard-btn');
    const backBtn = document.getElementById('back-to-start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const restartGameoverBtn = document.getElementById('restart-from-gameover-btn');
    const teamACard = document.getElementById('team-a-card');
    const teamBCard = document.getElementById('team-b-card');

    if (startBtn) startBtn.addEventListener('click', () => this._startGame());
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => this.ui.showLeaderboard());
    if (backBtn) backBtn.addEventListener('click', () => this.ui.showStartScreen(Storage.getHighScore()));
    if (restartBtn) restartBtn.addEventListener('click', () => this.ui.showStartScreen(Storage.getHighScore()));
    if (restartGameoverBtn) restartGameoverBtn.addEventListener('click', () => this._restartGame());

    if (teamACard) teamACard.addEventListener('click', () => this._predict(teamACard.dataset.team));
    if (teamBCard) teamBCard.addEventListener('click', () => this._predict(teamBCard.dataset.team));
  }

  _startGame() {
    const name = this.ui.getPlayerName();
    this.game.init(name);
    Storage.clearGameState();
    this._loadMatch();
  }

  _restartGame() {
    this._startGame();
  }

  _loadMatch() {
    const match = this.game.getCurrentMatch();
    if (!match) {
      this._endGame();
      return;
    }
    this.ui.showMatchScreen(
      match,
      this.game.score,
      this.game.streak,
      this.game.currentMatchIndex,
      this.game.totalMatches()
    );
    Storage.saveGameState(this.game.getState());
  }

  _predict(teamCode) {
    if (this.game.isGameOver) return;

    const match = this.game.getCurrentMatch();
    if (!match) return;

    const result = this.game.predict(teamCode);

    if (result) {
      this.ui.showResult(
        result.match,
        result.prediction,
        result.correct,
        result.score,
        result.streak,
        () => {
          if (result.isGameOver) {
            this._endGame();
          } else {
            Storage.saveGameState(this.game.getState());
            this._loadMatch();
          }
        }
      );
    }
  }

  _endGame() {
    Storage.clearGameState();
    const total = this.game.totalMatches();
    const highScore = Math.max(Storage.getHighScore(), this.game.score);
    if (this.game.score > 0) {
      Storage.saveHighScore(this.game.score, this.game.playerName);
    }
    this.ui.showGameOverScreen(
      this.game.score,
      this.game.correctPredictions,
      total,
      this.game.bestStreak
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
