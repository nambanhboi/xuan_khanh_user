import { createBrowserRouter, Navigate } from "react-router-dom";
import React from 'react';
import LoginPage from "../pages/login";
import RegisterPage from "../pages/register";
import NotFoundPage from "../notFoundPage";
import TestComponent from "../pages/TestComponent";
import { routesConfig } from "./routes";
import MainLayout from "../layout/MainLayout";
import TrangChu from "../pages/trang-chu";
import CuaHang from "../pages/cua-hang";
import GioHang from "../pages/gio-hang";
import ChiTietSanPham from "../pages/cua-hang/chi-tiet-san-pham/chi-tiet";
import AccountInfo from "../pages/thong-tin-tai-khoan";
import OrderTrackingPage from "../pages/theo-doi-don-hang";
import ThanhToan from "../pages/thanh-toan";
import ThanhToanThanhCong from "../pages/thanh-toan/thanh-toan-thanh-cong";
// import ThanhToanThanhCong from "../pages/thanh-toan/thanh-toan-thanh-cong";

export const router = createBrowserRouter([
  //người mua
  {
    path: "login",
    element: <LoginPage />
  },
  {
    path: "register",
    element: <RegisterPage />
  },

  //cửa hàng
  {
    path: routesConfig.cuaHang,
    element: (
      <MainLayout breadcrumb = {["Trang chủ", "Cửa hàng"]}>
        <CuaHang />
      </MainLayout>
    )
  },
  {
    path: routesConfig.chiTietSanPham,
    element: (
      <MainLayout breadcrumb = {["Trang chủ", "Cửa hàng", "Chi tiết sản phẩm"]}>
        <ChiTietSanPham />
      </MainLayout>
    )
  },
  //trang chủ
  {
    path: routesConfig.trangChu,
    element: (
      <MainLayout >
        <TrangChu />
      </MainLayout>
    )
  },
  //thanh toán
  {
    path: routesConfig.thanhToan,
    element: (
      <MainLayout breadcrumb = {["Trang chủ", "Cửa hàng", "Thanh toán"]}>
        <ThanhToan />
      </MainLayout>
    )
  },
  {
    path: routesConfig.thanhToanThanhCong,
    element: (
      <MainLayout breadcrumb = {["Trang chủ", "Cửa hàng", "Thanh toán"]}>
        <ThanhToanThanhCong />
      </MainLayout>
    )
  },
  //giỏ hàng
  {
    path: routesConfig.gioHang,
    element: (
      <MainLayout breadcrumb = {["Trang chủ", "Giỏ hàng"]}>
        <GioHang />
      </MainLayout>
    )
  },
  // {
  //   path: routesConfig.testComponent,
  //   element: (
  //     <MainLayout breadcrumb={["Trang chủ", "Test component"]}>
  //       <TestComponent />
  //     </MainLayout>
  //   )
  // },
  {
    path: routesConfig.thongTinTaiKhoan,
    element: (
      <MainLayout breadcrumb={["Trang chủ","Thông tin tài khoản"]}>
        <AccountInfo />
      </MainLayout>
    )
  },
  {
    path: routesConfig.theoDoiDonHang,
    element: (
      <MainLayout breadcrumb={["Trang chủ","Theo dõi đơn hàng"]}>
        <OrderTrackingPage />
      </MainLayout>
    )
  },

  //các trường hợp khác
  //path mặc định
  {
    path: "",
    element: <Navigate to="/trang-chu" replace />
  },
  //404 not found
  {
    path: "not-found",
    element: <NotFoundPage /> // Hiển thị trang 404
  },
  {
    path: "*",
    element: <Navigate to="/not-found" replace /> // Chuyển hướng đến /not-found nếu đường dẫn không hợp lệ
  }
]);
