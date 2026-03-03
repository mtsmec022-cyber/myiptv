export interface IPTVChannel {
  id: string;
  name: string;
  logo?: string;
  url: string;
  group: string;
  epgId?: string;
}

export interface IPTVPlaylist {
  id: string;
  name: string;
  url?: string;
  type: 'm3u' | 'xtream';
  username?: string;
  password?: string;
  server?: string;
}

export interface EPGProgram {
  start: string;
  stop: string;
  title: string;
  description?: string;
}
