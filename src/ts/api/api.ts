import { BASE_URL, NOT_FOUND_CODE_STATUS } from '../constants/constants';
import { PeopleData } from '../interfaces/PeopleData';

const API = {
  async getData() {
    const response = await fetch(`${BASE_URL}`); // получаем response объект
    const data = await response.json(); // преобразовывем в json формат
    return data;
  },

  async updateDataItem(body: PeopleData, id: string) { //body - данные, пришедшие из формы, id - идентификационный номер объекта, который нужно изменить
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT', //используем метод PUT для полной перезаписи объекта, в отличие от PATCH, который обновляет частично
      headers: {
        'Content-Type': 'application/json', //определяем тип передаваемой информации
      },
      body: JSON.stringify(body), //прописыаем тело объекта. Используется JSON.stringify для приведения данных в строку
    });
    if (response.status === NOT_FOUND_CODE_STATUS) { // пробрасываем ошибку, если статус респонса 404
      throw new Error(`People with ${id} id is not found`);
    }
    const result = await response.json();
    return result; // возвращаем обновленный объект
  },
};

export default API;
