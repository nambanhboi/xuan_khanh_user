import axios from "axios";
import { refreshToken } from "../services/AuthenServices";
import ShowToast from "../components/show-toast/ShowToast";


export const BASE_URL = process.env.REACT_APP_BASE_API_URL;

//api không cần xác thực
export const axiosCustom: any = axios.create({
  baseURL: BASE_URL,
  timeout: 1000 * 60 * 60 * 10,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

//api cần xác thực
export const axiosConfig: any = axios.create({
    baseURL: BASE_URL,
    timeout: 1000 * 60 * 60 * 10,
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
    },
  });

axiosConfig.interceptors.request.use(
  
    (config: any) => {

      const auth = localStorage.getItem("auth");
      if(auth) {
        config.headers["Authorization"] = `Bearer ${JSON.parse(auth).token}`;        
      }
      return config;
    },

    (error: any) => {
      return Promise.reject(error);
    }
);

axiosConfig.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (error.response && error.response.status === 401) {
      //xử lý khi hết hạn token
      refreshToken({refreshToken: JSON.parse(localStorage.getItem("auth")!).refreshToken})
      .then(async (res:any)=> {
        if(res.data.errrorMessage && res.data.errrorMessage === "Refresh Token đã hết hạn") {
          localStorage.removeItem("auth");
          await ShowToast("warning", "Thông báo", "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        else{
          localStorage.setItem("auth", JSON.stringify(res.data));
        }
      })
      .catch(async (err: any) => {
        await ShowToast("error", "Lỗi", "Lỗi khi lấy access token mới");
      });
    }
    return Promise.reject(error);
  }
);