import { useLocation, useNavigate } from "react-router-dom";
import GroupLabel from "../../components/group-label";
import "./style.scss";
import { useEffect, useState } from "react";
import ShowToast from "../../components/show-toast/ShowToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Button, Image, Radio, Skeleton, Spin, Table, Typography } from "antd";
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
            <div className="thanh-toan-left">
              <GroupLabel label="Thông tin sản phẩm" />
              <div>
                <Table
                  pagination={false}
                  columns={columns}
                  dataSource={dataThanhToan}
                />
              </div>
            </div>

            <div className="thanh-toan-right">
              <GroupLabel label="Thông tin nhận hàng" />
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="ten">
                  <Typography.Text>Tên: {dataUser.ten}</Typography.Text>
                </div>
                <div className="sdt">
                  <Typography.Text>
                    Số điện thoại: {dataUser.so_dien_thoai}
                  </Typography.Text>
                </div>
                <div className="dia_chi">
                  <Typography.Text>Địa chỉ: {dataUser.dia_chi}</Typography.Text>
                </div>
                <div
                  className="thay-doi-thong-tin"
                  style={{ marginTop: "16px" }}
                >
                  <Button
                    onClick={() => {
                      navigate(routesConfig.thongTinTaiKhoan);
                    }}
                  >
                    Thay đổi thông tin
                  </Button>
                </div>
                <GroupLabel label="Phương thức thanh toán" />
                <Radio.Group
                  onChange={(e: RadioChangeEvent) =>
                    setPhuongThucThanhToan(e.target.value)
                  }
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    fontSize: "16px",
                  }}
                >
                  <Radio value="0">
                    <Image
                      preview={false}
                      width={"30%"}
                      src="/images/stripe.png"
                    />
                  </Radio>
                  <Radio value="1">
                    <Image
                      preview={false}
                      width={"38%"}
                      style={{ marginLeft: "10px", marginBottom: "10px" }}
                      src="/images/ZaloPay_Logo.png"
                    />
                  </Radio>
                  <Radio value="2"> Thanh toán khi nhận hàng </Radio>
                </Radio.Group>
              </div>
            </div>
          </div>
          <div className="tong-tien">
            <Typography.Text>
              Tổng tiền ({dataThanhToan.length} sản phẩm):{" "}
              <GroupLabel label={tinhTongTienGioHang(dataThanhToan)} />
            </Typography.Text>
            <ButtonCustom
              text="THANH TOÁN"
              onClick={() => {
                if (PhuongThucThanhToan === "0") {
                  fetchCheckoutSession("stripe"); // Trigger Stripe payment
                } else if (PhuongThucThanhToan === "1") {
                  fetchCheckoutSession("zalopay"); // Trigger ZaloPay payment
                } else if(PhuongThucThanhToan === "2") {
                  fetchCheckoutSession("2");
                }
              }}
            />

          </div>
        </div>
      </Spin>
    );
  } else {
    return <Skeleton active />;
  }
};

export default ThanhToan;
