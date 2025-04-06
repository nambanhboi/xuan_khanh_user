import axios, { AxiosResponse } from "axios";
import { axiosConfig, axiosCustom, BASE_URL } from "../../config/configApi";


export const DanhGia: (id: string, listDanhGia: any) => Promise<AxiosResponse<any>> = (id: string, listDanhGia: any) => {
    return axiosConfig.post(`/api/danh-gia/danh-gia-don-hang?id=${id}`, listDanhGia);
};