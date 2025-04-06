import axios, { AxiosResponse } from "axios";
import { axiosConfig, axiosCustom, BASE_URL } from "../../config/configApi";

export const GetAllSanPham: (pageNumber: number, pageSize: number, danhMucId: string) => Promise<AxiosResponse<any>> = (pageNumber: number, pageSize: number, danhMucId: string) => {
    return axiosConfig.get(`/api/DanhSachSanPham/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}&danh_muc_id=${danhMucId}`);
};
export const GetAllDanhMucSanPham: (pageNumber: number, pageSize: number) => Promise<AxiosResponse<any>> = (pageNumber: number, pageSize: number) => {
    return axiosConfig.get(`/api/DanhMucSanPham/get-all?pageNumber=${pageNumber}&pageSize=${pageSize}`);
};