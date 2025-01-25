// const BASE_URL = "http://localhost:5000/api/v1";
const BASE_URL = "https://testing-bd2g.onrender.com/api/v1";

export const authEndpoints = {
  SIGNUP: `${BASE_URL}/signup`,
  LOGIN: `${BASE_URL}/login`,
  LOGOUT: `${BASE_URL}/logout`,
};

export const bookEndpoints = {
  CREATE_BOOK: `${BASE_URL}/book`,
  GET_SINGLE_BOOK: `${BASE_URL}/book/:id`,
  GET_ALL_BOOKS: `${BASE_URL}/books`,
  UPDATE_BOOK: `${BASE_URL}/book/:id`,
  DELETE_BOOK: `${BASE_URL}/book/:id`,
};
