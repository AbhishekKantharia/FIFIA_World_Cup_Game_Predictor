const flags = {
  MEX: '\u{1F1F2}\u{1F1FD}',
  RSA: '\u{1F1FF}\u{1F1E6}',
  KOR: '\u{1F1F0}\u{1F1F7}',
  CZE: '\u{1F1E8}\u{1F1FF}',
  CAN: '\u{1F1E8}\u{1F1E6}',
  BIH: '\u{1F1E7}\u{1F1E6}',
  USA: '\u{1F1FA}\u{1F1F8}',
  PAR: '\u{1F1F5}\u{1F1FE}',
  QAT: '\u{1F1F6}\u{1F1E6}',
  SUI: '\u{1F1E8}\u{1F1ED}',
  BRA: '\u{1F1E7}\u{1F1F7}',
  MAR: '\u{1F1F2}\u{1F1E6}',
  HAI: '\u{1F1ED}\u{1F1F9}',
  SCO: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}',
  AUS: '\u{1F1E6}\u{1F1FA}',
  TUR: '\u{1F1F9}\u{1F1F7}',
  GER: '\u{1F1E9}\u{1F1EA}',
  CUW: '\u{1F1E8}\u{1F1FC}',
  NED: '\u{1F1F3}\u{1F1F1}',
  JPN: '\u{1F1EF}\u{1F1F5}',
  CIV: '\u{1F1E8}\u{1F1EE}',
  ECU: '\u{1F1EA}\u{1F1E8}',
  SWE: '\u{1F1F8}\u{1F1EA}',
  TUN: '\u{1F1F9}\u{1F1F3}',
  ESP: '\u{1F1EA}\u{1F1F8}',
  CPV: '\u{1F1E8}\u{1F1FB}',
  BEL: '\u{1F1E7}\u{1F1EA}',
  EGY: '\u{1F1EA}\u{1F1EC}',
  KSA: '\u{1F1F8}\u{1F1E6}',
  URU: '\u{1F1FA}\u{1F1FE}',
  IRN: '\u{1F1EE}\u{1F1F7}',
  NZL: '\u{1F1F3}\u{1F1FF}',
  FRA: '\u{1F1EB}\u{1F1F7}',
  SEN: '\u{1F1F8}\u{1F1F3}',
  IRQ: '\u{1F1EE}\u{1F1F6}',
  NOR: '\u{1F1F3}\u{1F1F4}',
  ARG: '\u{1F1E6}\u{1F1F7}',
  ALG: '\u{1F1E9}\u{1F1FF}',
  AUT: '\u{1F1E6}\u{1F1F9}',
  JOR: '\u{1F1EF}\u{1F1F4}',
  POR: '\u{1F1F5}\u{1F1F9}',
  COD: '\u{1F1E8}\u{1F1E9}',
  ENG: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}',
  CRO: '\u{1F1ED}\u{1F1F7}',
  GHA: '\u{1F1EC}\u{1F1ED}',
  PAN: '\u{1F1F5}\u{1F1E6}',
  UZB: '\u{1F1FA}\u{1F1FF}',
  COL: '\u{1F1E8}\u{1F1F4}'
};

class DataStore {
  static getCompletedMatches() {
    return MATCHES_DATA.filter(m => m.winner !== null);
  }

  static getUpcomingMatches() {
    return MATCHES_DATA.filter(m => m.winner === null);
  }

  static getMatchById(id) {
    return MATCHES_DATA.find(m => m.id === id);
  }

  static getFlag(code) {
    return flags[code] || '';
  }

  static getAllMatches() {
    return MATCHES_DATA;
  }

  static getMatchesByStage(stage) {
    return MATCHES_DATA.filter(m => m.stage === stage);
  }
}
