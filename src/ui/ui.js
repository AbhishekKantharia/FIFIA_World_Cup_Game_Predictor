class UI {
  constructor() {
    this.currentScreen = null;
    this.game = null;
    this._cache = {};
  }

  init(game) {
    this.game = game;
    this._cacheElements();
    this._setupBackground();
  }

  _cacheElements() {
    const ids = [
      'start-screen', 'match-screen', 'gameover-screen', 'leaderboard-screen',
      'start-btn', 'leaderboard-btn', 'back-to-start-btn', 'restart-btn',
      'restart-from-gameover-btn', 'game-title', 'high-score-value',
      'team-a-card', 'team-b-card', 'match-stage', 'match-date-venue',
      'score-value', 'streak-info', 'progress-fill', 'progress-text',
      'team-a-flag', 'team-b-flag', 'team-a-name', 'team-b-name',
      'team-a-code', 'team-b-code', 'team-a-score', 'team-b-score',
      'result-overlay', 'result-icon', 'result-title', 'result-detail',
      'result-next-btn', 'gameover-score', 'gameover-correct',
      'gameover-streak', 'gameover-total', 'player-name-input',
      'leaderboard-body', 'leaderboard-list'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) this._cache[id] = el;
    });
  }

  _setupBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    this._initParticles(canvas);
  }

  _initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        o: Math.random() * 0.5 + 0.2
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.o})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = this._cache[screenId];
    if (screen) {
      screen.classList.add('active');
      screen.style.animation = 'none';
      void screen.offsetHeight;
      screen.style.animation = 'fadeIn 0.4s ease';
    }
    this.currentScreen = screenId;
  }

  showStartScreen(highScore) {
    const hsEl = this._cache['high-score-value'];
    if (hsEl) hsEl.textContent = highScore;
    this.showScreen('start-screen');
  }

  showMatchScreen(match, score, streak, matchIndex, total) {
    if (!match) return;

    const stageEl = this._cache['match-stage'];
    const infoEl = this._cache['match-date-venue'];
    const scoreVal = this._cache['score-value'];
    const streakInfo = this._cache['streak-info'];
    const progressFill = this._cache['progress-fill'];
    const progressText = this._cache['progress-text'];

    if (stageEl) stageEl.textContent = match.stage;
    if (infoEl) infoEl.textContent = `${match.date}  |  ${match.venue}`;
    if (scoreVal) {
      scoreVal.textContent = score;
      scoreVal.style.animation = 'none';
      void scoreVal.offsetHeight;
      scoreVal.style.animation = 'scorePopup 0.4s ease';
    }
    if (streakInfo) {
      streakInfo.textContent = streak > 0 ? `Streak: ${streak}` : '';
    }
    if (progressFill) {
      progressFill.style.width = `${(matchIndex / total) * 100}%`;
    }
    if (progressText) {
      progressText.textContent = `Match ${Math.min(matchIndex + 1, total)} of ${total}`;
    }

    const aCard = this._cache['team-a-card'];
    const bCard = this._cache['team-b-card'];
    [aCard, bCard].forEach(c => {
      if (c) {
        c.className = 'team-card';
        c.style.pointerEvents = 'auto';
      }
    });

    const aFlag = this._cache['team-a-flag'];
    const bFlag = this._cache['team-b-flag'];
    const aName = this._cache['team-a-name'];
    const bName = this._cache['team-b-name'];
    const aCode = this._cache['team-a-code'];
    const bCode = this._cache['team-b-code'];
    const aScore = this._cache['team-a-score'];
    const bScore = this._cache['team-b-score'];

    if (aFlag) aFlag.textContent = DataStore.getFlag(match.teamA.code);
    if (bFlag) bFlag.textContent = DataStore.getFlag(match.teamB.code);
    if (aName) aName.textContent = match.teamA.name;
    if (bName) bName.textContent = match.teamB.name;
    if (aCode) aCode.textContent = match.teamA.code;
    if (bCode) bCode.textContent = match.teamB.code;
    if (aScore) aScore.textContent = '';
    if (bScore) bScore.textContent = '';

    aCard.dataset.team = match.teamA.code;
    bCard.dataset.team = match.teamB.code;

    this.showScreen('match-screen');
  }

  showResult(match, prediction, correct, score, streak, callback) {
    const aCard = this._cache['team-a-card'];
    const bCard = this._cache['team-b-card'];
    const aScore = this._cache['team-a-score'];
    const bScore = this._cache['team-b-score'];

    if (aScore) aScore.textContent = match.scoreA;
    if (bScore) bScore.textContent = match.scoreB;

    [aCard, bCard].forEach(c => {
      if (c) {
        c.classList.add('reveal');
        c.style.pointerEvents = 'none';
      }
    });

    const winningCard = prediction === match.teamA.code ? aCard : bCard;

    if (correct) {
      if (winningCard) winningCard.classList.add('correct');
      if (match.winner === match.teamA.code && aCard) aCard.classList.add('correct');
      if (match.winner === match.teamB.code && bCard) bCard.classList.add('correct');
    } else {
      if (winningCard) winningCard.classList.add('incorrect');
      if (match.winner === match.teamA.code && aCard) aCard.classList.add('correct');
      if (match.winner === match.teamB.code && bCard) bCard.classList.add('correct');
    }

    const overlay = this._cache['result-overlay'];
    const icon = this._cache['result-icon'];
    const title = this._cache['result-title'];
    const detail = this._cache['result-detail'];
    const nextBtn = this._cache['result-next-btn'];

    if (correct) {
      if (icon) icon.textContent = '\u2705';
      if (title) { title.textContent = 'Correct!'; title.className = 'title success'; }
      if (detail) detail.textContent = `${match.teamA.name} ${match.scoreA} - ${match.scoreB} ${match.teamB.name}`;
      if (nextBtn) {
        nextBtn.textContent = 'Next Match';
        nextBtn.onclick = () => {
          overlay.classList.remove('active');
          callback();
        };
      }
      this._confetti();
    } else {
      if (icon) icon.textContent = '\u274C';
      if (title) { title.textContent = 'Wrong Prediction!'; title.className = 'title fail'; }
      const winnerName = match.winner === match.teamA.code ? match.teamA.name : match.teamB.name;
      if (detail) detail.textContent = `${match.teamA.name} ${match.scoreA} - ${match.scoreB} ${match.teamB.name}  |  Winner: ${winnerName}`;
      if (nextBtn) {
        nextBtn.textContent = 'See Results';
        nextBtn.onclick = () => {
          overlay.classList.remove('active');
          callback();
        };
      }
    }

    overlay.classList.add('active');
  }

  showGameOverScreen(score, correct, total, bestStreak) {
    const scoreEl = this._cache['gameover-score'];
    const correctEl = this._cache['gameover-correct'];
    const streakEl = this._cache['gameover-streak'];
    const totalEl = this._cache['gameover-total'];

    if (scoreEl) scoreEl.textContent = score;
    if (correctEl) correctEl.textContent = correct;
    if (streakEl) streakEl.textContent = bestStreak;
    if (totalEl) totalEl.textContent = total;

    this.showScreen('gameover-screen');

    const hs = Storage.getHighScore();
    if (score >= hs && score > 0) {
      Storage.saveHighScore(score, this.game.playerName);
    }
  }

  showLeaderboard() {
    const entries = Storage.getLeaderboard();
    const body = this._cache['leaderboard-body'];
    if (!body) return;

    body.innerHTML = '';

    if (entries.length === 0) {
      body.innerHTML = '<tr><td colspan="4" class="leaderboard-empty">No leaderboard entries yet. Play a game!</td></tr>';
    } else {
      entries.slice(0, 20).forEach((entry, i) => {
        const tr = document.createElement('tr');
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
        const date = new Date(entry.date).toLocaleDateString();
        tr.innerHTML = `
          <td class="rank ${rankClass}">${i + 1}</td>
          <td class="player-name">${this._escapeHtml(entry.name)}</td>
          <td class="player-score">${entry.score}</td>
          <td class="player-date">${date}</td>
        `;
        body.appendChild(tr);
      });
    }

    this.showScreen('leaderboard-screen');
  }

  showLoading() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="loading-screen">
        <div class="loading-spinner"></div>
        <p style="color: var(--text-muted);">Loading World Cup data...</p>
      </div>
    `;
  }

  _confetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    const colors = ['#d4af37', '#00e676', '#ff1744', '#2979ff', '#ff9100', '#e040fb'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${Math.random() * 8 + 4}px`;
      piece.style.height = `${Math.random() * 8 + 4}px`;
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = `${Math.random() * 2 + 2}s`;
      piece.style.animationDelay = `${Math.random() * 0.5}s`;
      container.appendChild(piece);
    }
    document.body.appendChild(container);
    setTimeout(() => container.remove(), 4000);
  }

  showError(message) {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div style="text-align:center;padding:40px;">
        <div style="font-size:3rem;margin-bottom:16px;">⚠️</div>
        <h2 style="margin-bottom:12px;">Something went wrong</h2>
        <p style="color:var(--text-muted);margin-bottom:24px;">${this._escapeHtml(message)}</p>
        <button class="btn btn-primary" onclick="location.reload()">Try Again</button>
      </div>
    `;
  }

  getPlayerName() {
    const input = this._cache['player-name-input'];
    return input ? input.value.trim() || 'Anonymous' : 'Anonymous';
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}
