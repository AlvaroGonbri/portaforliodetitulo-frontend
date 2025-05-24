export interface groups {
  id: number;
  name: string;
}

export interface userProfile {
  cargo?: string;
}

export interface users {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  groups: groups[];
  profile: userProfile | null;
}
