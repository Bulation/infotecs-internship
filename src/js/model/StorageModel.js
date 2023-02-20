export default class StorageModel {
  constructor() {}

  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  hasKey(key) {
    return localStorage.getItem(key);
  }

  load(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}