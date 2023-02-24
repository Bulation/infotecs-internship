import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import fetch from 'jest-fetch-mock';
import { COUNT_PER_PAGE } from "../ts/constants/constants";
import DataModel from "../ts/model/dataModel";
import mockData from "./mockData.json";

test('length of array is 50', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockData))
  const model = new DataModel();
  await model.loadData();
  expect(model.peopleData.length).toBe(50);
});

test('length of sliced array is 10', async () => {
  fetch.mockResponseOnce(JSON.stringify(mockData))
  const model = new DataModel();
  await model.loadData();
  expect(model.sliceData().length).toBe(COUNT_PER_PAGE);
});
