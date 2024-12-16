export interface EventData {
  data: Data;
  eventType: string;
  uri: string;
}
export interface Data {
  actions?: ((ActionsEntityEntity)[] | null)[] | null;
  allowBattleBoost: boolean;
  allowDuplicatePicks: boolean;
  allowLockedEvents: boolean;
  allowRerolling: boolean;
  allowSkinSelection: boolean;
  bans: Bans;
  benchChampionIds?: (null)[] | null;
  benchEnabled: boolean;
  boostableSkinCount: number;
  chatDetails: ChatDetails;
  counter: number;
  entitledFeatureState: EntitledFeatureState;
  gameId: number;
  hasSimultaneousBans: boolean;
  hasSimultaneousPicks: boolean;
  isCustomGame: boolean;
  isSpectating: boolean;
  localPlayerCellId: number;
  lockedEventIndex: number;
  myTeam?: (MyTeamEntityOrTheirTeamEntity)[] | null;
  rerollsRemaining: number;
  skipChampionSelect: boolean;
  theirTeam?: (MyTeamEntityOrTheirTeamEntity)[] | null;
  timer: Timer;
  trades?: (TradesEntity)[] | null;
}
export interface ActionsEntityEntity {
  actorCellId: number;
  championId: number;
  completed: boolean;
  id: number;
  isAllyAction: boolean;
  isInProgress: boolean;
  pickTurn: number;
  type: string;
}
export interface Bans {
  myTeamBans?: (number)[] | number;
  numBans: number;
  theirTeamBans?: (number)[] | number;
}
export interface ChatDetails {
  chatRoomName: string;
  chatRoomPassword?: null;
}
export interface EntitledFeatureState {
  additionalRerolls: number;
  unlockedSkinIds?: (null)[] | null;
}
export interface MyTeamEntityOrTheirTeamEntity {
  assignedPosition: string;
  cellId: number;
  championId: number;
  championPickIntent: number;
  entitledFeatureType: string;
  selectedSkinId: number;
  spell1Id: number;
  spell2Id: number;
  summonerId: number;
  team: number;
  wardSkinId: number;
}
export interface Timer {
  adjustedTimeLeftInPhase: number;
  internalNowInEpochMs: number;
  isInfinite: boolean;
  phase: string;
  totalTimeInPhase: number;
}
export interface TradesEntity {
  cellId: number;
  id: number;
  state: string;
}



export interface Member {
  allowedChangeActivity: boolean;
  allowedInviteOthers: boolean;
  allowedKickOthers: boolean;
  allowedStartActivity: boolean;
  allowedToggleInvite: boolean;
  autoFillEligible: boolean;
  autoFillProtectedForPromos: boolean;
  autoFillProtectedForSoloing: boolean;
  autoFillProtectedForStreaking: boolean;
  botChampionId: number;
  botDifficulty: string;
  botId: string;
  firstPositionPreference: string;
  isBot: boolean;
  isLeader: boolean;
  isSpectator: boolean;
  puuid: string;
  ready: boolean;
  secondPositionPreference: string;
  showGhostedBanner: boolean;
  summonerIconId: number;
  summonerId: number;
  summonerInternalName: string;
  summonerLevel: number;
  summonerName: string;
  teamId: number;
}
