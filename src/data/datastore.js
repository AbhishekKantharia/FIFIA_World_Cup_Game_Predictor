class DataStore {
  constructor() {
    this._teams = [];
    this._matches = [];
    this._stadiums = [];
    this._teamMap = {};
    this._stadiumMap = {};
    this._loaded = false;
    this._loading = false;
    this._loadPromise = null;
  }

  async load() {
    if (this._loaded) return;
    if (this._loading) return this._loadPromise;

    this._loading = true;
    this._loadPromise = this._doLoad();
    return this._loadPromise;
  }

  async _doLoad() {
    try {
      const data = await ApiService.fetchAll();
      this._teams = data.teams;
      this._matches = data.matches;
      this._stadiums = data.stadiums;

      this._teamMap = {};
      this._teams.forEach(t => {
        this._teamMap[t.id] = t;
        this._teamMap[t.fifa_code] = t;
      });

      this._stadiumMap = {};
      this._stadiums.forEach(s => {
        this._stadiumMap[s.id] = s;
      });

      this._loaded = true;
    } catch (e) {
      this._loading = false;
      throw e;
    }
    this._loading = false;
  }

  getCompletedMatches() {
    return this._matches
      .filter(m => m.finished === 'TRUE' && m.time_elapsed === 'finished')
      .map(m => this._enrichMatch(m));
  }

  getAllMatches() {
    return this._matches.map(m => this._enrichMatch(m));
  }

  _enrichMatch(m) {
    const home = this._teamMap[m.home_team_id];
    const away = this._teamMap[m.away_team_id];

    return {
      id: parseInt(m.id),
      teamA: {
        name: m.home_team_name_en || home?.name_en || 'TBD',
        code: home?.fifa_code || 'TBD',
        flag: home?.flag || ''
      },
      teamB: {
        name: m.away_team_name_en || away?.name_en || 'TBD',
        code: away?.fifa_code || 'TBD',
        flag: away?.flag || ''
      },
      stage: ApiService.stageLabel(m.type, m.group),
      date: ApiService.normalizeDate(m.local_date),
      venue: this._getStadiumName(m.stadium_id),
      scoreA: m.home_score !== null ? parseInt(m.home_score) : null,
      scoreB: m.away_score !== null ? parseInt(m.away_score) : null,
      winner: this._determineWinner(m),
      finished: m.finished === 'TRUE',
      type: m.type,
      group: m.group
    };
  }

  _determineWinner(m) {
    if (m.finished !== 'TRUE') return null;
    const hs = parseInt(m.home_score);
    const as = parseInt(m.away_score);
    if (hs > as) return this._teamMap[m.home_team_id]?.fifa_code || null;
    if (as > hs) return this._teamMap[m.away_team_id]?.fifa_code || null;
    return null;
  }

  _getStadiumName(stadiumId) {
    const s = this._stadiumMap[stadiumId];
    return s ? `${s.name_en}, ${s.city_en}` : `Stadium ${stadiumId}`;
  }

  getFlag(code) {
    const team = this._teamMap[code];
    if (team?.flag) return team.flag;
    return '';
  }

  isLoaded() {
    return this._loaded;
  }
}
