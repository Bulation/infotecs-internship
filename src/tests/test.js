import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { COUNT_PER_PAGE } from "../js/constants/constants";
import DataModel from "../js/model/dataModel.js";
import mockData from "./mockData.json";
import rgbToHex from '../js/helperFunctions/rgbToHex';

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

test('rgb(124, 100, 43) is #7c642b', async () => {
  expect(rgbToHex('rgb(124, 100, 43)')).toBe('#7c642b');
});
