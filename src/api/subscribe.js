import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const countSub = async (chanelCode) => {
  return await instance.get(`sub/${chanelCode}/count`);
};

const authorize = axios.create({
  baseURL: "http://localhost:8080/api/private",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

//"http://localhost:8080/api/private/sub/2"
export const getSub = async (channelCode) => {
  return await authorize.get(`sub/${channelCode}`);
};

// 생성 무엇이 필요한가???
export const addSub = async (data) => {
  return await authorize.post("sub", data);
};
//
export const removeSub = async (subCode) => {
  return await authorize.delete(`sub/${subCode}`);
};
