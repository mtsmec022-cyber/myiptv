import axios from 'axios';

export interface XtreamUserInfo {
  username: string;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  max_connections: string;
}

export class XtreamService {
  private server: string;
  private user: string;
  private pass: string;

  constructor(server: string, user: string, pass: string) {
    this.server = server.endsWith('/') ? server.slice(0, -1) : server;
    this.user = user;
    this.pass = pass;
  }

  private getUrl(action: string, params: Record<string, string> = {}) {
    const searchParams = new URLSearchParams({
      username: this.user,
      password: this.pass,
      action,
      ...params
    });
    const targetUrl = `${this.server}/player_api.php?${searchParams.toString()}`;
    return `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
  }

  async authenticate(): Promise<XtreamUserInfo> {
    const response = await axios.get(this.getUrl(''));
    if (response.data.user_info) {
      return response.data.user_info;
    }
    throw new Error('Falha na autenticação');
  }

  async getLiveCategories() {
    const response = await axios.get(this.getUrl('get_live_categories'));
    return response.data;
  }

  async getLiveStreams(categoryId?: string) {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axios.get(this.getUrl('get_live_streams', params));
    return response.data;
  }

  async getVodCategories() {
    const response = await axios.get(this.getUrl('get_vod_categories'));
    return response.data;
  }

  async getVodStreams(categoryId?: string) {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axios.get(this.getUrl('get_vod_streams', params));
    return response.data;
  }

  async getSeriesCategories() {
    const response = await axios.get(this.getUrl('get_series_categories'));
    return response.data;
  }

  async getSeriesStreams(categoryId?: string) {
    const params = categoryId ? { category_id: categoryId } : {};
    const response = await axios.get(this.getUrl('get_series', params));
    return response.data;
  }

  getStreamUrl(streamId: string, extension: string = 'm3u8', type: 'live' | 'movie' | 'series' = 'live') {
    const path = type === 'live' ? '' : type === 'movie' ? 'movie/' : 'series/';
    const targetUrl = `${this.server}/${path}${this.user}/${this.pass}/${streamId}.${extension}`;
    return `/api/stream?url=${encodeURIComponent(targetUrl)}`;
  }
}
