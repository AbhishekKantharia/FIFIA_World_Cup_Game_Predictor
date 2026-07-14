const API_BASE = 'https://worldcup26.ir';

class ApiService {
  static async fetchMatches() {
    const res = await fetch(`${API_BASE}/get/games`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.games || [];
  }

  static async fetchTeams() {
    const res = await fetch(`${API_BASE}/get/teams`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.teams || [];
  }

  static async fetchStadiums() {
    const res = await fetch(`${API_BASE}/get/stadiums`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.stadiums || [];
  }

  static async fetchAll() {
    const [matches, teams, stadiums] = await Promise.all([
      this.fetchMatches(),
      this.fetchTeams(),
      this.fetchStadiums()
    ]);
    return { matches, teams, stadiums };
  }

  static stageLabel(type, group) {
    if (type === 'group') return `Group ${group}`;
    const labels = {
      r32: 'Round of 32',
      r16: 'Round of 16',
      qf: 'Quarterfinal',
      sf: 'Semifinal',
      third: 'Third Place Playoff',
      final: 'Final'
    };
    return labels[type] || type;
  }

  static normalizeDate(localDate) {
    const [month, day, year, time] = localDate.split(/[\/ ]/);
    const date = new Date(2026, parseInt(month) - 1, parseInt(day));
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${parseInt(day)}, ${year}`;
  }
}
