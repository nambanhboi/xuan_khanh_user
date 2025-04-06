import axios, { AxiosResponse } from "axios";
import { axiosConfig, axiosCustom, BASE_URL } from "../../config/configApi";

export const login: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
    return axiosConfig.post("/api/Authen/Login", body);
};

export const loginAdmin: (body: any) => Promise<AxiosResponse<any> | null> = async (body: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/Authen/LoginAdmin`, body);
    
        return response; // Sẽ nhận được "Đăng nhập thành công"
      } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return null;
      }
};

export const refreshToken: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosCustom.post("/api/Authen/RefreshToken/refresh-token", body);
};


export const UpdatePassword: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.put("/api/Authen/UpdatePassword", body);
};

export const UpdateEmail: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.put("/api/Authen/UpdateEmail", body);
};

export const UpdatePhone: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.put("/api/Authen/UpdatePhone", body);
};
export const getDetailAcc: () => Promise<AxiosResponse<any>> = () => {
  return axiosConfig.get("/api/Authen/getDetailAcc");
};
// ngân hàng
export const AddBankAccount: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.post("/api/ngan-hang/add-bank-account", body);
};
export const UpdateBankAccount: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.put("/api/ngan-hang", body);
};
export const DeleteBankAccount: (id: any) => Promise<AxiosResponse<any>> = (id: any) => {
  return axiosConfig.delete(`/api/ngan-hang/${id}`);
};
export const SetDefaultBankAccount: (id: string) => Promise<AxiosResponse<any>> = (id: string) => {
  return axiosConfig.put(`/api/ngan-hang/${id}/set-default`);
};

export const UpdateUser: (body: any) => Promise<AxiosResponse<any>> = (body: any) => {
  return axiosConfig.put("/api/Authen/UpdateUser", body);
};