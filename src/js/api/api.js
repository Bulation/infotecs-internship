import { BASE_URL, NOT_FOUND_CODE_STATUS } from "../constants/constants.js";

const API = {
  
  async getData() {
    const response = await fetch(`${BASE_URL}`);
    const data = await response.json();
    return data;
  },

  async getDataItem(id) {
    const response = await fetch(`BASE_URL/${id}`);
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`People with ${id} id is not found`);
    }
    const data = await response.json();
    return data;
  },

  async updateDataItem(body, id) {
    const response = await fetch(`BASE_URL/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (response.status === NOT_FOUND_CODE_STATUS) {
      throw new Error(`Car with ${id} id is not found`);
    }
    const result = await response.json();
    return result;
  },
}

export default API;