/* eslint-disable @typescript-eslint/no-explicit-any */

class LocalStorageService {
  static setItem(key: string, item: any) {
    localStorage.setItem(key, JSON.stringify({ data: item }));
  }

  static getItem<T>(key: string, initState?: T): any {
    const item = localStorage.getItem(key);
    if (!item) {
      return initState ? initState : null;
    }
    const deserializedItem = JSON.parse(item);
    if (!deserializedItem) {
      return null;
    }
    if (!deserializedItem.hasOwnProperty('data') || !deserializedItem.data) {
      return null;
    }
    return deserializedItem.data;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}

export default LocalStorageService;
