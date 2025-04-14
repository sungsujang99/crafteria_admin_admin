import axios from "axios";

export const urlAxios = axios.create({
    baseURL: `https://api.crafteria.co.kr/`,
});
