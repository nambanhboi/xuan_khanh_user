import { ShoppingCartOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React from 'react';


export const config = {
    
}

export const menuItem :MenuProps["items"] = [
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
  ];


  export const ConvertNumberToVND = (value:number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }