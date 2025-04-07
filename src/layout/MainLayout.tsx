import { RouterProvider, useLocation, useNavigate } from "react-router-dom";
import { router } from "../routes/router";
import "../global.scss";
import React, { useState } from "react";
import { Breadcrumb, Flex, Layout, Menu, MenuProps, Spin } from "antd";
import HeaderLayout from "./Header";
import "./HeaderLayout.scss";

const { Content, Footer, Sider } = Layout;

const MainLayout: React.FC<{
  children?: React.ReactNode;
  breadcrumb?: string[];
}> = ({ children, breadcrumb }) => {
  const location = useLocation(); // Lấy thông tin route hiện tại
  const [loading, setLoading] = useState<boolean>(false);

  // Kiểm tra nếu route là "/login"
  if (location.pathname === "/login") {
    return <RouterProvider router={router} />;
  }

  return (
    <Layout className="header-component">
      <Spin spinning={loading}>
        <HeaderLayout setLoading={setLoading}/>
        <Content style={{ padding: "0" }}>
          {
            breadcrumb ? <Breadcrumb style={{ margin: "16px 20px" }}>
            {breadcrumb ? breadcrumb.map((item) => {
              return <Breadcrumb.Item>{item}</Breadcrumb.Item>;
            }) : null}
          </Breadcrumb> : null
          }
          
          <div
            style={{
              backgroundColor: "#FFFFFF",
              minHeight: "75vh",
              // padding: 24,
              borderRadius: 5,
            }}
          >
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
        DK ©{new Date().getFullYear()} Created by Dương Xuân Khánh
        </Footer>
      </Spin>
    </Layout>
  );
};

export default MainLayout;
