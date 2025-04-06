import React from "react";
import { Modal, Form, Input, Button, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./login.scss";
import { axiosConfig } from "../config/configApi";
import ShowToast from "../components/show-toast/ShowToast";

const { Title, Text } = Typography;

const RegisterPage: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  isCloseRegis?: (val: boolean) => void;
  setLoading?: (val: boolean) => void;
}> = ({ isOpen = true, onClose, isCloseRegis, setLoading }) => {
  const onFinish = (values: any) => {
    setLoading?.(true)
    if (values.mat_khau === values.mat_khau_repeat) {
      axiosConfig
        .post("api/Authen/Register", {
          tai_khoan: values.tai_khoan,
          mat_khau: values.mat_khau,
        })
        .then((res: any) => {
          ShowToast("success", "Thông báo", "Đăng ký thành công", 3);
          isCloseRegis?.(false);
        })
        .catch((err: any) => {
          ShowToast("success", "Thông báo", "Có lỗi xảy ra", 3);
        })
        .finally(()=> {
          setLoading?.(false)
        })
    } else {
      ShowToast("warning", "Thông báo", "Nhập lại mật khẩu không đúng", 3);
    }
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
        <Title level={3}>Register to member</Title>
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
            allowClear
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="mat_khau"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Tạo mật khẩu"
            allowClear
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="mat_khau_repeat"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Tạo mật khẩu"
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

        <div
          className="bottom-text"
          onClick={() => {
            isCloseRegis?.(false);
          }}
        >
          <Text>
            Đã có tài khoản? <a href="#">Đăng nhập</a>
          </Text>
        </div>
      </Form>
    </Modal>
  );
};

export default RegisterPage;
