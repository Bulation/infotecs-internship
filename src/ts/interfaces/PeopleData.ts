export interface PeopleData { // интерфейс для объекта в массиве имеющиъся данных
  id?: string;
  name: {
    firstName: string;
    lastName: string;
  };
  phone: string;
  about: string;
  eyeColor: string;
}
