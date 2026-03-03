import { get, set, del, clear } from 'idb-keyval';

export const StorageKeys = {
  LIVE_CATS: 'vortex_cache_live_cats',
  LIVE_STREAMS: 'vortex_cache_live_streams',
  VOD_CATS: 'vortex_cache_vod_cats',
  VOD_STREAMS: 'vortex_cache_vod_streams',
  SERIES_CATS: 'vortex_cache_series_cats',
  SERIES_STREAMS: 'vortex_cache_series_streams',
};

export const storage = {
  /**
   * Clears old localStorage keys to free up space (migration to IndexedDB)
   */
  clearOldLocalStorage: () => {
    const keysToRemove = [
      'vortex_cache_live_cats',
      'vortex_cache_live_streams',
      'vortex_cache_vod_cats',
      'vortex_cache_vod_streams',
      'vortex_cache_series_cats',
      'vortex_cache_series_streams'
    ];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },
  get: async <T>(key: string): Promise<T | null> => {
    try {
      const data = await get<T>(key);
      return data || null;
    } catch (err) {
      console.error(`Storage Error (get ${key}):`, err);
      return null;
    }
  },
  set: async <T>(key: string, value: T): Promise<void> => {
    try {
      await set(key, value);
    } catch (err: any) {
      if (err.name === 'QuotaExceededError' || err.message?.includes('quota')) {
        console.error(`Storage Quota Exceeded for ${key}`);
        throw new Error('Espaço de armazenamento insuficiente no navegador.');
      }
      console.error(`Storage Error (set ${key}):`, err);
      throw err;
    }
  },
  remove: async (key: string): Promise<void> => {
    try {
      await del(key);
    } catch (err) {
      console.error(`Storage Error (remove ${key}):`, err);
    }
  },
  clearAll: async (): Promise<void> => {
    try {
      await clear();
    } catch (err) {
      console.error('Storage Error (clearAll):', err);
    }
  }
};
