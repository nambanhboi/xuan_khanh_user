import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Menu,
  MenuProps,
  Space,
  Tooltip,
} from "antd";
import { Header } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routesConfig } from "../routes/routes";
import {
  AppstoreOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import ShowToast from "../components/show-toast/ShowToast";
import LoginPage from "../pages/login";
import ButtonCustom from "../components/button/button";
import RegisterPage from "../pages/register";
import { getDetailAcc } from "../services/AuthenServices";
import { axiosConfig } from "../config/configApi"; 

type HeaderLayoutProps = {
  setLoading?: (va: boolean) => void;
};

const HeaderLayout: React.FC<HeaderLayoutProps> = ({ setLoading }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState<any>();
  const [user, setUser] = useState<any>();
  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

  // Hàm lấy dữ liệu tài khoản
  const getData = async () => {
    await getDetailAcc()
      .then((response: any) => {
        setUser(response.data);
      })
      .catch((error: any) => {
        // ShowToast(
        //   "error",
        //   "Thông báo",
        //   "Không thể lấy thông tin tài khoản. Vui lòng thử lại sau",
        //   3
        // );
      });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const checkAuth = localStorage.getItem("auth");
    if (checkAuth) {
      setAuth(checkAuth);
    }
  }, []);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axiosConfig.get("/api/DanhMucSanPham/get-all?pageSize=99");
        const DanhMuc = response.data.items;

        const items = [
          {
            key: "trang-chu",
            icon: React.createElement(UserOutlined),
            label: "Trang chủ",
          },
          {
            key: "cua-hang",
            icon: React.createElement(ShopOutlined),
            label: "Cửa hàng",
          },
          // {
          //   key: "gio-hang",
          //   icon: React.createElement(ShoppingCartOutlined),
          //   label: "Giỏ hàng",
          // },
          ...(DanhMuc ?? []).map((item: any) => ({
            key: item.id  ,
            icon: React.createElement(AppstoreOutlined ),
            label: item.ten_danh_muc,
          })),
        ];

        setMenuItems(items);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, []);

  //xác thực
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [isLoginModalVisibleReg, setIsLoginModalVisibleReg] = useState(false);

  const showLoginModal = () => {
    setIsLoginModalVisible(true);
  };

  const handleChangeMenu: MenuProps["onClick"] = (item: any) => {
    if (item.key === "trang-chu") {
      navigate(`/${routesConfig.trangChu}`);
    } else
    if (item.key === "cua-hang") {
      navigate(routesConfig.cuaHang);
    }else{
      navigate(`${routesConfig.cuaHang}/${item.key}`);
      // window.location.reload();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth");
    ShowToast("success", "Đăng xuất thành công", "Hẹn gặp lại bạn sau!");
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      label: <>Thông tin tài khoản</>,
      key: "0",
      onClick: () => {
        navigate("/thong-tin-tai-khoan");
      },
    },
    {
      label: <>Đơn hàng</>,
      key: "1",
      onClick: () => {
        navigate(routesConfig.theoDoiDonHang);
      },
    },
    {
      key: "dang-xuat",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  return (
    <div className="header-layout">
      <div style={{ backgroundColor: "var(--color-red-primary)", padding: "5px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "white", marginLeft: "20px", fontWeight: "bold" }} className="small-text">NƯỚC HOA & MỸ PHẨM CHÍNH HÃNG TỪ 2004</span>
        <div style={{ display: "flex", alignItems: "center", marginRight: "20px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "5px", padding: "5px 10px", display: "flex", alignItems: "center" }}>
            <SearchOutlined style={{ marginRight: "5px" }} />
            <Input type="text" placeholder="Tìm kiếm nước hoa của bạn ..." style={{ border: "none", outline: "none", height: "25px", width: "500px" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", marginLeft: "20px" }}>
            <span style={{ color: "white", marginLeft: "20px", display: "flex" }} className="small-text"> <InfoCircleOutlined style={{ marginRight: "5px" }} /> Giờ vàng tại Orchard |</span>
            <span style={{ color: "white", marginLeft: "5px", display: "flex",cursor:"pointer" }} className="small-text" onClick={() => navigate(routesConfig.theoDoiDonHang)}> <ShoppingCartOutlined style={{ marginRight: "5px",  }} /> Tra cứu lịch sử mua hàng</span>
          </div>
        </div>
      </div>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "var(--white-color) !important",
        }}
      >
        <img
          src="/images/logo_removeBg.png"
          alt="DK Logo"
          style={{ width: "10%", margin: "20px 0", color: "#FFF" }}
        />
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={menuItems}
          onClick={handleChangeMenu}
          style={{ flex: 1, minWidth: 0 }}
        />

        <div className="header-user">
          <Tooltip title="Giỏ hàng">
            <Avatar
              icon={<ShoppingCartOutlined />}
              style={{ marginRight: "10px", cursor: "pointer" }}
              onClick={() => {
                const auth = localStorage.getItem("auth");
                if (!auth) {
                  showLoginModal();
                } else {
                  navigate(routesConfig.gioHang);
                }
              }}
            />
          </Tooltip>
          {auth ? (
            <Dropdown menu={{ items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space style={{ color: "black" }}>
                  <Avatar icon={<UserOutlined />} />
                  {user ? (user.ten ? user.ten : "Người dùng") : "Người dùng"}
                </Space>
              </a>
            </Dropdown>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <ButtonCustom
                text="Đăng nhập"
                style={{ backgroundColor: "var(--color-primary-6)" }}
                onClick={() => setIsLoginModalVisible(true)}
              />
              <Button onClick={() => setIsLoginModalVisibleReg(true)}>
                Đăng ký
              </Button>
            </div>
          )}
        </div>
      </Header>

      <LoginPage
        isOpen={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
        handleCloseModal={setIsLoginModalVisible}
        setLoading={setLoading}
      />
      <RegisterPage
        isOpen={isLoginModalVisibleReg}
        onClose={() => setIsLoginModalVisibleReg(false)}
        setLoading={setLoading}
      />
    </div>
  );
};

export default HeaderLayout;
