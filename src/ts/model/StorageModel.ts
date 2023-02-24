export default class StorageModel { // класс для работы с local storage
  constructor() {}

  save(key: string, value: unknown) { // сохраняем значение в local storage
    localStorage.setItem(key, JSON.stringify(value));
  }

  hasKey(key: string) { // проверяем, есть ли такой ключ в Local storage
    return localStorage.getItem(key);
  }

  load(key: string) { // загружаем данные из local storage
    return JSON.parse(localStorage.getItem(key));
  }
}
