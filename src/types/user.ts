export interface User {
  id: string;
  email: string;
  name: string;
  can_create_songs: boolean;
  can_publish_songs: boolean;
  can_create_playlists: boolean;
  is_admin: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface JwtPayload {
  user_id: string;
  email: string;
  exp: number;
  iat: number;
}
