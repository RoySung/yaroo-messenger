export type UserStatus =
  | 'available'
  | 'busy'
  | 'away'
  | 'invisible'
  | 'offline';

export interface User {
  id: string;
  nickname: string;
  status: UserStatus;
  customStatus?: string;
  avatar: string;
  message?: string;
}
