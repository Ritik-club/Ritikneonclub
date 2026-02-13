
export enum ColorType {
  RED = 'RED',
  GREEN = 'GREEN',
  VIOLET = 'VIOLET'
}

export type BigSmallType = 'Big' | 'Small';
export type BetStatus = 'Pending' | 'Win' | 'Loss';
export type TransactionStatus = 'Pending' | 'Completed' | 'Rejected';
export type TransactionType = 'Deposit' | 'Withdrawal';
export type GameMode = '30sec' | '1min' | '3min' | '5min';

export enum GameType {
  WINGO = 'WINGO',
  AVIATOR = 'AVIATOR',
  MINES = 'MINES',
  CHICKEN = 'CHICKEN',
  VORTEX = 'VORTEX',
  CRICKET = 'CRICKET',
  DRAGON_TIGER = 'DRAGON_TIGER',
  K3 = 'K3',
  D5 = 'D5',
  CUSTOM = 'CUSTOM'
}

export interface GameResult {
  id: string;
  period: string;
  number: number;
  colors: ColorType[];
  bigSmall: BigSmallType;
  timestamp: number;
}

export interface UserBet {
  id: string;
  game?: GameType;
  period: string;
  mode: GameMode | string;
  amount: number;
  selection: ColorType | number | BigSmallType | string;
  status: BetStatus;
  payout?: number;
  timestamp: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  coins: number;
  status: TransactionStatus;
  timestamp: number;
  utr?: string;
  userUpiId?: string;
  screenshotUrl?: string;
}

export interface Message {
  id: string;
  userId: string;
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  type: 'System' | 'Wallet';
}

export interface UserState {
  id: string;
  phone: string;
  password?: string;
  balance: number;
  referralCode: string;
  avatarUrl?: string;
  vipLevel: number;
  totalTurnover: number;
}

export interface GiftCode {
  code: string;
  amount: number;
}

export interface CustomGame {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export enum Tab {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  WALLET = 'WALLET',
  INBOX = 'INBOX',
  PROFILE = 'PROFILE',
  SUPPORT = 'SUPPORT',
  ADMIN = 'ADMIN'
}

export type ImageSize = '1K' | '2K' | '4K';
