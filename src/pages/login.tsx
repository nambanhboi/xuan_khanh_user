import React, { useState } from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.scss";
import RegisterPage from "./register";
import { axiosConfig } from "../config/configApi";
import ShowToast from "../components/show-toast/ShowToast";

const { Title, Text } = Typography;

const LoginPage: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  handleCloseModal?: (val: boolean) => void;
  setLoading?: (val: boolean) => void;
}> = ({ isOpen = true, onClose, handleCloseModal,setLoading }) => {
  const [isOpenRes, setIsOpenRes] = useState<boolean>(false);
  const onFinish = (values: any) => {
    setLoading?.(true)
    axiosConfig
      .post(`api/Authen/Login`, {
        mat_khau: values.mat_khau,
        tai_khoan: values.tai_khoan,
      })
      .then((res: any) => {
        localStorage.setItem("auth", JSON.stringify(res.data));
        window.location.reload();
      })
      .catch((er: any) => {
        if (er.response.data.includes("Mật khẩu không đúng")) {
          ShowToast(
            "warning",
            "Thông báo",
            "Tài khoản hoặc mật khẩu không chính xác",
            3
          );
        } else {
          ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
        }
      }).finally(()=> {
        setLoading?.(false)
      })
  };

  const handleRegister = () => {
    setIsOpenRes(true);
  };

  return (
    <Modal
      open={isOpen}
      centered
      footer={null}
      className="login-modal"
      onCancel={onClose}
    >
      <div className="login-header">
        <img
          src="/images/logo_removeBg.png"
          alt="G-Connect Logo"
          style={{ width: "50%", marginLeft: "25%" }}
        />
        <Title level={3}>Welcome to G-Connect</Title>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          name="tai_khoan"
          rules={[{ required: true, message: "Vui lòng nhập tên tài khoản!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Tài khoản"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="mat_khau"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Mật khẩu"
            allowClear
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-button"
            style={{ width: "100%", backgroundColor: "var(--color-primary-5)" }}
          >
            Tiếp tục
          </Button>
        </Form.Item>

        <div className="social-login">
          <Button type="default" icon={<UserOutlined />} block>
            Đăng nhập với Facebook
          </Button>
        </div>

        <div className="bottom-text" onClick={handleRegister}>
          <Text>
            Chưa có tài khoản? <a href="#">Đăng ký</a>
          </Text>
        </div>
      </Form>

      <RegisterPage
        isOpen={isOpenRes}
        onClose={() => setIsOpenRes(false)}
        isCloseRegis={setIsOpenRes}
      />
    </Modal>
  );
};

export default LoginPage;
