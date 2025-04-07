import { ShoppingCartOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React from 'react';
import { axiosConfig } from "./config/configApi";

var DanhMuc;
axiosConfig.get("/api/DanhMucSanPham/get-all?pageSize=99")
.then((response:any) => {
    DanhMuc = response.data.items;
})

export const config = {
    
}

export const fetchMenuItems = async (): Promise<MenuProps["items"]> => {
  try {
    const response = await axiosConfig.get("/api/DanhMucSanPham/get-all?pageSize=99");
    const DanhMuc = response.data.items;

    return [
      {
        key: "trang-chu",
        icon: React.createElement(UserOutlined),
        label: "Trang chủ",
      },
      {
        key: "cua-hang",
        icon: React.createElement(TeamOutlined),
        label: "Cửa hàng",
      },
      {
        key: "gio-hang",
        icon: React.createElement(ShoppingCartOutlined),
        label: "Giỏ hàng",
      },
      ...(DanhMuc ?? []).map((item: any) => ({
        key: item.id,
        icon: React.createElement(ShoppingCartOutlined),
        label: item.ten_danh_muc,
      })),
    ];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

  export const ConvertNumberToVND = (value:number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }