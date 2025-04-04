import axios from "axios";

export const BASE_URL="http://localhost:8080"
const axiosInstance = axios.create({ baseURL: BASE_URL });
axios.interceptors.request.use(request => {
  console.log('Starting Request', request)
  return request; 
})
axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);
 
export default axiosInstance;