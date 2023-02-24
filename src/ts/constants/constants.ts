import { SortNameType } from '../types/SortNameType';

export const BASE_URL = 'https://63ea06f9e0ac9368d6487f93.mockapi.io/json'; // url для получения доступа к json
export const NOT_FOUND_CODE_STATUS = 404; // статус респонса
export const TABLE_HEADER: SortNameType[] = ['firstName', 'lastName', 'about', 'eyeColor']; // массив заголовков таблицы
export const COUNT_PER_PAGE = 10; // количество строк в таблице согласно требованиям
export const COLUMNS_COUNT = 4; // количество колонок в таблице
export const COLORS_NAME = { // объект, в котором каждому цвету соответсвует HEX значение. Костыль, нужный для корректной обработки и сортировки цветов, лучше варианта не придумал
  blue: '#0000ff',
  brown: '#a52a2a',
  red: '#ff0000',
  green: '#008000',
};
export const DATA_ERROR_MSG = 'Произошла ошибка при отправке данных. Попробуйте повторить попозже';
export const PHONE_PATTERN = '^(\\+)?7(\\s+)?\\(?[0-9]{3}\\)?(\\s+)?[0-9]{3}(-|\\s+)?[0-9]{4}$'; // регулярное выражение для валидации номера телефона
export const NAME_ERROR_MSG = 'Name must contain at least 2 symbols'; // дальше идут тексты ошибок, если введено невалидное значение в форме
export const LASTNAME_ERROR_MSG = 'Lastname must contain at least 2 symbols';
export const PHONE_ERROR_MSG = 'Phone must me written with 11 digits, example - +7 (999) 999-9999';
