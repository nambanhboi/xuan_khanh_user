import { useLocation, useNavigate } from "react-router-dom";
import GroupLabel from "../../components/group-label";
import "./style.scss";
import { useEffect, useState } from "react";
import ShowToast from "../../components/show-toast/ShowToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button, Col, Image, Radio, Row, Skeleton, Spin, Table, Typography } from "antd";
import ButtonCustom from "../../components/button/button";
import { routesConfig } from "../../routes/routes";
import { getDetailAcc } from "../../services/AuthenServices";
import { ConvertNumberToVND } from "../../config";
import { axiosConfig, BASE_URL } from "../../config/configApi";
import { RadioChangeEvent } from "antd/lib";

import { loadStripe, } from "@stripe/stripe-js";

type ThanhToanProps = {};
interface CustomJwtPayload extends JwtPayload {
  id?: string; // hoặc number nếu `dvvc_id` là số
}

const stripePromise = loadStripe(
  "pk_test_51Q8O0QP8pkt4z3LRmIpao1p9442pEMDykIqSwOTxgJnYuZeyQYrHAy4LJTdcjUrqcw2eBnpG6vacPVhQYhGjd2xs0010yH3DtH"
);

const ThanhToan: React.FC<ThanhToanProps> = ({}) => {
  const location = useLocation();
  const dataThanhToan = location.state;
  const [loading, setLoading] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<any>();
  const [PhuongThucThanhToan, setPhuongThucThanhToan] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      var user = jwtDecode<CustomJwtPayload>(JSON.parse(token).token);
      if (user) {
        setLoading(true);
        getDetailAcc()
          .then((res: any) => {
            setDataUser(res.data);
          })
          .catch((err: any) => {
            ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  useEffect(() => {
    if (!dataThanhToan) {
      ShowToast("warning", "Thông báo", "Không có dữ liệu tanh toán", 3);
    }
  }, [dataThanhToan]);
  //table
  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "san_pham",
      render: (san_pham: any) => (
        <img
          src={`${BASE_URL}/${san_pham ? san_pham.duong_dan_anh_bia : ""}`}
          alt="product"
          width={"80%"}
        />
      ),
      width: "15%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "san_pham",
      render: (san_pham: any) => <>{san_pham ? san_pham.ten_san_pham : ""}</>,
      width: "20%",
    },
    {
      title: "Giá",
      dataIndex: "san_pham",
      render: (san_pham: any, record: any) => (
        <div style={{ fontSize: "16px" }}>
          {san_pham.khuyen_mai
            ? ConvertNumberToVND(san_pham.khuyen_mai * record.so_luong)
            : ConvertNumberToVND(san_pham.gia * record.so_luong)}
        </div>
      ),
      width: "15%",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      width: "10%",
      render: (so_luong: any, record: any) => (
        <div style={{ fontSize: "16px" }}>{so_luong}</div>
      ),
    },
    {
      title: "Biến thể",
      dataIndex: "san_pham",
      render: (san_pham: any, record: any) => (
        <div
          style={{
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {san_pham?.mau_sac ? `Màu: ${san_pham?.mau_sac}` : ""}
          {san_pham?.kich_thuoc ? `Màu: ${san_pham?.kich_thuoc}` : ""}
        </div>
      ),
      width: "20%",
    },
  ];

  const tinhTongTienGioHang = (gioHang: any[], onlyNumber?: boolean) => {
    let tongTien = 0;
    onlyNumber = onlyNumber ? onlyNumber : false;
    gioHang.forEach((item) => {
      if (item) {
        // Kiểm tra xem có khuyến mãi không
        const gia =
          item.san_pham.khuyen_mai !== null
            ? item.san_pham.khuyen_mai
            : item.san_pham.gia;

        // Tính tổng tiền cho sản phẩm được chọn
        tongTien += gia * item.so_luong;
      }
    });
    if (onlyNumber) {
      return tongTien; // Ensure the return type is always a number
    } else {
      return tongTien.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
  };


  const fetchCheckoutSession = async (paymentMethod = "stripe") => {
    try {
        setLoading(true);
        const successUrl = "https://49c4-2405-4802-1c94-6da0-8cd-a9a-a12c-5d71.ngrok-free.app/thanh-toan-thanh-cong";
        const cancelUrl = "https://49c4-2405-4802-1c94-6da0-8cd-a9a-a12c-5d71.ngrok-free.app/trang-chu";
        
        const dataCreateCheckoutSession = {
            successUrl: successUrl,
            cancelUrl: cancelUrl,
            priceInCents: tinhTongTienGioHang(dataThanhToan, true),
            userId: dataUser.id.toString(),
        };

        // Handle different payment methods (Stripe or ZaloPay)
        if (paymentMethod === "stripe") {
            // Stripe logic
            const response = await axiosConfig.post(
                `${BASE_URL}/api/thanh-toan/create-checkout-session`,
                dataCreateCheckoutSession
            );

            if (response.data && response.data.sessionId) {
                const stripe = await stripePromise;

                const dataTT = {
                    stripeSessionId: response.data.sessionId,
                    successUrl: successUrl,
                    cancelUrl: cancelUrl,
                    priceInCents: tinhTongTienGioHang(dataThanhToan, true),
                    userId: dataUser.id.toString(),
                    donHang: {
                        account_id: dataUser.id,
                        tong_tien: tinhTongTienGioHang(dataThanhToan, true),
                        thanh_tien: tinhTongTienGioHang(dataThanhToan, true),
                        ds_chi_tiet_don_hang: dataThanhToan.map((item: any) => ({
                            san_pham_id: item.san_pham.id,
                            so_luong: item.so_luong,
                            don_gia: item.san_pham.gia,
                            mau_sac: item.san_pham.mau_sac,
                            kich_thuoc: item.san_pham.kich_thuoc,
                            thanh_tien: item.san_pham.gia * item.so_luong,
                        })),
                        tai_khoan: dataUser,
                    },
                };

                // API success before redirecting
                await axiosConfig.post(`${BASE_URL}/api/thanh-toan/success`, dataTT)
                    .then(async (res: any) => {
                        if (res.data === "Payment successful.") {
                            ShowToast("success", "Thông báo", "Thanh toán thành công", 3);
                            await stripe?.redirectToCheckout({ sessionId: response.data.sessionId });
                        } else {
                            ShowToast("error", "Thông báo", "Có lỗi xảy ra trong quá trình thanh toán", 3);
                        }
                    })
                    .catch(() => ShowToast("error", "Thông báo", "Có lỗi xảy ra trong quá trình thanh toán", 3))
                    .finally(() => setLoading(false));
            } else {
                throw new Error("API không trả về sessionId");
            }
        } else if (paymentMethod === "zalopay") {
          // Call the API to create a ZaloPay order
          const dataTT = {
                account_id: dataUser.id,
                tong_tien: tinhTongTienGioHang(dataThanhToan, true),
                thanh_tien: tinhTongTienGioHang(dataThanhToan, true),
                ds_chi_tiet_don_hang: dataThanhToan.map((item: any) => ({
                    san_pham_id: item.san_pham.id,
                    so_luong: item.so_luong,
                    don_gia: item.san_pham.gia,
                    mau_sac: item.san_pham.mau_sac,
                    kich_thuoc: item.san_pham.kich_thuoc,
                    thanh_tien: item.san_pham.gia * item.so_luong,
                })),
                tai_khoan: dataUser,
          };
          const response = await axiosConfig.post(
              `${BASE_URL}/api/thanh-toan/zalo-create-order`,
              dataTT
          );
          console.log("ZaloPay response:", response); // Debugger
          debugger
          if (response.data && response.data.paymentUrl) {
              // Redirect to ZaloPay payment page
              window.location.href = response.data.paymentUrl;
          } else {
              ShowToast("error", "Thông báo", "Có lỗi xảy ra trong quá trình tạo đơn hàng ZaloPay", 3);
          }
      } else if (paymentMethod == "2") {
        const dataTT = {
          account_id: dataUser.id,
          tong_tien: tinhTongTienGioHang(dataThanhToan, true),
          thanh_tien: tinhTongTienGioHang(dataThanhToan, true),
          ds_chi_tiet_don_hang: dataThanhToan.map((item: any) => ({
              san_pham_id: item.san_pham.id,
              so_luong: item.so_luong,
              don_gia: item.san_pham.gia,
              mau_sac: item.san_pham.mau_sac,
              kich_thuoc: item.san_pham.kich_thuoc,
              thanh_tien: item.san_pham.gia * item.so_luong,
          })),
          tai_khoan: dataUser,
        };
        const response = await axiosConfig.post(
            `${BASE_URL}/api/thanh-toan/create-order-tien-mat`,
            dataTT
        );
        if (response.data) {
          ShowToast("success", "Thông báo", "Đặt hàng thành công", 3);
          window.location.href = "/";
      } else {
          ShowToast("error", "Thông báo", "Có lỗi xảy ra trong quá trình tạo đơn hàng ZaloPay", 3);
      }
      }
    } catch (error) {
        ShowToast("error", "Thông báo", "Không thể tạo phiên thanh toán. Vui lòng thử lại.", 3);
        setLoading(false);
    }
};


  if (dataUser) {
    return (
      <Spin spinning={loading}>
        <div className="thanh-toan">
          <div className="thong-tin-thanh-toan">
            

          <div className="thanh-toan-left" style={{ borderRadius: "8px", border: "1px solid var(--color-gray-300)", padding: "20px" }}>
  <GroupLabel label="Thông tin nhận hàng" style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }} />

  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "20px" }}>
    <div className="ten">
      <Typography.Text style={{ fontSize: "16px", color: "#333", lineHeight: "1.8" }}>
        Tên: <span style={{ fontWeight: "bold" }}>{dataUser.ten}</span>
      </Typography.Text>
    </div>

    <div className="sdt">
      <Typography.Text style={{ fontSize: "16px", color: "#333", lineHeight: "1.8" }}>
        Số điện thoại: <span style={{ fontWeight: "bold" }}>{dataUser.so_dien_thoai}</span>
      </Typography.Text>
    </div>

    <div className="dia_chi">
      <Typography.Text style={{ fontSize: "16px", color: "#333", lineHeight: "1.8" }}>
        Địa chỉ: <span style={{ fontWeight: "bold" }}>{dataUser.dia_chi}</span>
      </Typography.Text>
    </div>

    <div className="thay-doi-thong-tin" style={{ marginTop: "20px" }}>
      <Button
        onClick={() => {
          navigate(routesConfig.thongTinTaiKhoan);
        }}
        style={{
          width: "100%",
          padding: "16px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "background-color 0.3s",
        }}
      >
        Thay đổi thông tin
      </Button>
    </div>
  </div>
</div>

            <div className="thanh-toan-right" >
              <GroupLabel label="Thông tin sản phẩm" />
              <div>
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={dataThanhToan}
                />
              </div>
              <div className="phuong-thuc-thanh-toan">
                  <GroupLabel label="Phương thức thanh toán" />
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      flexDirection: "row", // Keep buttons in a row
                      justifyContent: "space-around", // Center buttons horizontally
                    }}
                  >
                    <Button
                      onClick={() => setPhuongThucThanhToan("0")}
                      style={{
                        backgroundImage: "url('/images/stripe.png')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "80px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "transparent",
                        fontSize: "16px",
                        width: "30%", // Fixed width for uniform button size
                        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                        ...(PhuongThucThanhToan === "0" && {
                          transform: "scale(1.1)", // Slightly enlarge button when selected
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add a shadow effect when active
                        }),
                      }}
                    />

                    <Button
                      onClick={() => setPhuongThucThanhToan("1")}
                      style={{
                        backgroundImage: "url('/images/ZaloPay_Logo.png')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "80px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "transparent",
                        fontSize: "16px",
                        width: "30%", // Fixed width for uniform button size
                        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                        ...(PhuongThucThanhToan === "1" && {
                          transform: "scale(1.1)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }),
                      }}
                    />

                <Button
                      onClick={() => setPhuongThucThanhToan("2")}
                      style={{
                        backgroundImage: "url('/images/tien_mat.png')",
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        height: "80px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "transparent",
                        fontSize: "16px",
                        width: "30%", // Fixed width for uniform button size
                        transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
                        ...(PhuongThucThanhToan === "2" && {
                          transform: "scale(1.1)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        }),
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    borderTop: "1px solid #f0f0f0", // Lighter border for better contrast
                    paddingTop: "16px",
                    marginTop: "16px",
                  }}
                >
                  <Row justify="space-between">
                    <Typography.Text style={{ fontSize: "14px", color: "#333" }}>Tạm tính</Typography.Text>
                    <Typography.Text style={{ fontSize: "14px", color: "#333" }}>
                      {tinhTongTienGioHang(dataThanhToan)}
                    </Typography.Text>
                  </Row>

                  <Row justify="space-between" style={{ marginTop: "8px" }}>
                    <Typography.Text style={{ fontSize: "14px", color: "#333" }}>Giao hàng</Typography.Text>
                    <Typography.Text style={{ fontSize: "14px", color: "#333" }}>
                      Nhập địa chỉ của bạn để xem các tùy chọn vận chuyển.
                    </Typography.Text>
                  </Row>

                  <Row justify="space-between" style={{ marginTop: "16px", fontWeight: "bold" }}>
                    <Typography.Text style={{ fontSize: "16px", color: "#000" }}>Tổng</Typography.Text>
                    <Typography.Text style={{ fontSize: "16px", color: "#000" }}>
                      {tinhTongTienGioHang(dataThanhToan)}
                    </Typography.Text>
                  </Row>
                </div>
            </div>
            
          </div>
          <div className="tong-tien" style={{borderTop: "1px solid #f0f0f0",}}>
            <div style={{ marginTop: "24px" }}>
              <Typography.Text style={{ fontSize: "16px", fontWeight: "bold" }}>
                Tổng tiền ({dataThanhToan.length} sản phẩm):{" "}
              </Typography.Text>
              <GroupLabel label={tinhTongTienGioHang(dataThanhToan)} />
            </div>

            <div style={{ marginTop: "16px" }}>
              <ButtonCustom
                text="THANH TOÁN"
                onClick={() => {
                  if (PhuongThucThanhToan === "0") {
                    fetchCheckoutSession("stripe"); // Trigger Stripe payment
                  } else if (PhuongThucThanhToan === "1") {
                    fetchCheckoutSession("zalopay"); // Trigger ZaloPay payment
                  } else if (PhuongThucThanhToan === "2") {
                    fetchCheckoutSession("2"); // Cash on delivery option
                  }
                }}
                style={{
                  width: "100%", // Full width for the button
                  padding: "14px", // Increase padding for a larger button
                  fontSize: "16px", // Increase font size for better readability
                  backgroundColor: "#007bff", // Button color
                  color: "#fff", // Text color
                  border: "none",
                  borderRadius: "4px", // Rounded corners
                  cursor: "pointer",
                }}
              />
            </div>
          </div>

        </div>
      </Spin>
    );
  } else {
    return <Skeleton active />;
  }
};

export default ThanhToan;
