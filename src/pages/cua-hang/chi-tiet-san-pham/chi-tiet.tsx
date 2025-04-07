import {
  Avatar,
  Button,
  Carousel,
  Collapse,
  Image,
  InputNumber,
  List,
  Radio,
  Rate,
  Splitter,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { axiosConfig, BASE_URL } from "../../../config/configApi";
import { useNavigate, useParams } from "react-router-dom";
import "./chi-tiet.scss";
import ShowToast from "../../../components/show-toast/ShowToast";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";
import { InputNumberProps } from "antd/lib";
import ButtonCustom from "../../../components/button/button";
import FormInputNumber from "../../../components/form-input-number/FormInputNumber";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { routesConfig } from "../../../routes/routes";

interface CustomJwtPayload extends JwtPayload {
  id?: string;
}

interface SanPham {
  id: string;
  mau_sac?: string;
  size?: string;
  ds_anh_san_pham: string[];
  ma_san_pham: string;
  ls_phan_loai: any[];
  ten_san_pham: string;
  ten_danh_muc: string;
  gia: number;
  khuyen_mai: number;
  luot_ban: number;
  duong_dan_anh_bia: string;
  mo_ta: string;
}

type DataDanhGia = {
  danh_gia_chat_luong?: number;
  noi_dung_danh_gia?: string;
  ten_san_pham?: string;
  ten_nguoi_dung?: string;
  phan_hoi?: string;
};
const ChiTietSanPham: React.FC = () => {
  const { ma } = useParams<{ ma: string }>();
  const [dataDetail, setDataDetail] = useState<SanPham[]>([]);
  const [danhGia, setDanhGia] = useState<DataDanhGia[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(0);
  const [auth, setAuth] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      var user = jwtDecode<CustomJwtPayload>(JSON.parse(token).token);
      if (user) {
        setAuth(user);
      }
    }
  }, []);
  //thông tin mua
  const [soLuong, setSoLuong] = useState<number>(1);
  const [kich_thuoc, set_kich_thuoc] = useState<string | null>(null);
  const [mau_sac, set_mau_sac] = useState<string | null>(null);
  useEffect(() => {
    GetById();
    getDanhGia();
  }, []);

  //đánh giá

  const GetById = async () => {
    setLoading(true);
    await axiosConfig
      .get(`api/DanhSachSanPham/get-by-ma/${ma}`)
      .then((res: any) => {
        setDataDetail(res.data);
        setRate(res.data[0].rate);
        // Xử lý ds_anh_san_pham thành mảng các đối tượng { duong_dan, ma_san_pham }
        const processedImages = res.data[0].ds_anh_san_pham.map(
          (item: any) => ({
            duong_dan: item,
            ma_san_pham: res.data[0].ma_san_pham,
          })
        );

        // Thêm ảnh bìa vào đầu danh sách
        setImages([
          {
            duong_dan: res.data[0].duong_dan_anh_bia,
            ma_san_pham: res.data[0].ma_san_pham,
          },
          ...processedImages,
        ]);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Lấy dữ liệu thất bại", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getDanhGia = async () => {
    axiosConfig
      .get(`/api/danh-gia/get-danh-gia/${ma}`)
      .then((res: any) => {
        console.log(res.data);
        setDanhGia(
          res.data.map((item: any) => {
            return {
              danh_gia_chat_luong: item.danh_gia_chat_luong,
              noi_dung_danh_gia: item.noi_dung_danh_gia,
              ten_san_pham: item.san_pham.ten_san_pham,
              ten_nguoi_dung: item.nguoi_dung.ten,
              phan_hoi: item.noi_dung_phan_hoi,
            };
          })
        );
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Lấy dữ liệu thất bại 1", 3);
      });
  };

  const onChange: InputNumberProps["onChange"] = (value: any) => {
    setSoLuong(value);
  };

  const handleChangeBienThe = (items: any, selected: any) => {
    if (items.ten_phan_loai === "mau-sac") {
      set_mau_sac(selected);
    }
    if (items.ten_phan_loai === "size") {
      set_kich_thuoc(selected);
    }
  };
  const navigate = useNavigate();

  const handleThemGioHang = (type: "mua-ngay" | "them-gio-hang") => {
    setLoading(true);
    if (dataDetail.length > 0) {
      const pl = dataDetail[0].ls_phan_loai;
      if (pl.length === 2) {
        if (mau_sac === null || mau_sac === undefined) {
          ShowToast(
            "warning",
            "Thông báo",
            "Bạn chưa chọn dung tích",
            3
          );
          return 0;
        }
        if (kich_thuoc === null || kich_thuoc === undefined) {
          ShowToast(
            "warning",
            "Thông báo",
            "Bạn chưa chọn loại nước hoa",
            3
          );
          return 0;
        }
      } else {
        if (pl.length === 1) {
          if (pl[0].ten_phan_loai === "mau-sac") {
            if (mau_sac === null || mau_sac === undefined) {
              ShowToast(
                "warning",
                "Thông báo",
                "Bạn chưa chọn dung tích sản phẩm",
                3
              );
              return 0;
            }
          }

          if (pl[0].ten_phan_loai === "size") {
            if (kich_thuoc === null || kich_thuoc === undefined) {
              ShowToast(
                "warning",
                "Thông báo",
                "Bạn chưa chọn loại nước hoa sản phẩm",
                3
              );
              return 0;
            }
          }
        }
      }
      // Tìm biến thể phù hợp dựa trên mau_sac và kich_thuoc đã chọn
      let bienThePhuHop: SanPham | undefined;

      if (mau_sac && kich_thuoc) {
        bienThePhuHop = dataDetail.find(
          (item: any) => item.mau_sac === mau_sac && item.size === kich_thuoc
        );
      } else if (mau_sac) {
        // Nếu chỉ màu sắc được chọn, tìm biến thể phù hợp theo màu sắc
        bienThePhuHop = dataDetail.find(
          (item: any) => item.mau_sac === mau_sac
        );
      } else if (kich_thuoc) {
        bienThePhuHop = dataDetail.find(
          (item: any) => item.size === kich_thuoc
        );
      } else {
        bienThePhuHop = dataDetail[0];
      }

      if (bienThePhuHop) {
        const san_pham_id = bienThePhuHop.id;
        const data = {
          nguoi_dung_id: auth.id,
          san_pham_id: san_pham_id,
          so_luong: soLuong,
          san_pham: {
            ...bienThePhuHop,
            ds_anh_san_pham: bienThePhuHop.ds_anh_san_pham.map(
              (duong_dan: string) => ({
                duong_dan: duong_dan,
                san_pham_id: san_pham_id,
              })
            ),
          },
        };

        // Gọi API thêm vào giỏ hàng ở đây với data
        if (type === "them-gio-hang") {
          axiosConfig
            .post("/api/gio-hang/created", data)
            .then(() => {
              ShowToast("success", "Thông báo", "Thêm giỏ hàng thành công", 3);
            })
            .catch(() => {
              ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
            })
            .finally(() => {
              setLoading(false);
            });
        } else {
          navigate(routesConfig.thanhToan, { state: [data] });
        }
      } else {
        ShowToast("error", "Lỗi", "Không tìm thấy biến thể phù hợp", 3);
        setLoading(false);
      }
    } else {
      ShowToast("error", "Lỗi", "Không tìm thấy thông tin sản phẩm", 3);
      setLoading(false);
    }
  };

  return (
    <div className="chi-tiet-san-pham">
      <Splitter
        className="Splitter-ct"
        style={{
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          minHeight: "75vh",
        }}
      >
        <Splitter.Panel
          size={40}
          resizable={false}
          className="Splitter-ct-left"
        >
          <Carousel
            autoplay
            autoplaySpeed={5000}
            dots={false}
            arrows
            infinite={false}
            style={{ height: "580px", overflow: "hidden" }}
          >
            {images.map((item: any) => (
              <div
                key={item}
                style={{
                  overflow: "hidden",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectPosition: "center",
                    border: "1px solid rgb(214, 214, 214)",
                  }}
                  src={`${BASE_URL}/${item.duong_dan || "default-image.jpg"}`}
                />
              </div>
            ))}
          </Carousel>
        </Splitter.Panel>
        
        <Splitter.Panel size={35} resizable={false} className="Splitter-ct-right">
          <div className="thong-tin-san-pham">
            {/* Tên sản phẩm */}
            <Typography.Text className="ten-san-pham">
              {dataDetail.length > 0
                ? dataDetail[0].ten_san_pham
                : "Chưa có dữ liệu"}
            </Typography.Text>

            {/* tên danh mục */}
            <Typography.Text className="ten-danh-muc">
              {dataDetail.length > 0
                ? dataDetail[0].ten_danh_muc
                : "Chưa có dữ liệu"}
            </Typography.Text>

            {/* Đánh giá */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Rate
                disabled
                value={rate}
                allowHalf
                tooltips={["Tệ", "Tạm ổn", "Ôn", "Tốt", "Xuất sắc"]}
              />
              <Typography.Text>
                {dataDetail.length > 0
                  ? dataDetail[0].luot_ban
                    ? dataDetail[0].luot_ban
                    : 0
                  : 0}{" "}
                lượt bán{" "}
              </Typography.Text>
            </div>

            {/* Giá sản phẩm */}
            <div>
              {dataDetail.length > 0 ? (
                dataDetail[0].khuyen_mai ? (
                  <Typography.Text
                    delete
                    className="gia-san-pham gia-khuyen-mai"
                  >
                    {dataDetail[0].gia.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography.Text>
                ) : (
                  <Typography.Text className="gia-san-pham">
                    {dataDetail[0].gia.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </Typography.Text>
                )
              ) : (
                "Không có dữ liệu"
              )}{" "}
              <span></span>
              <Typography.Text className="gia-san-pham">
                {dataDetail.length > 0
                  ? dataDetail[0].khuyen_mai
                    ? dataDetail[0].khuyen_mai.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    : ""
                  : ""}
              </Typography.Text>
            </div>

            {/* Biến thể */}
            <div style={{ width: "100%" }}>
              {dataDetail.length > 0
                ? dataDetail[0].ls_phan_loai.length > 0
                  ? dataDetail[0].ls_phan_loai.map((item: any) => {
                      return (
                        <div>
                          <Typography.Text>
                            {item.ten_phan_loai === "dung-tich"
                              ? "Dung tích"
                              : "Loại"}
                          </Typography.Text>
                          <Radio.Group
                            block
                            options={item.phan_loai.map((x: any) => {
                              return {
                                value: x,
                                label: x,
                              };
                            })}
                            onChange={(value: any) => {
                              handleChangeBienThe(item, value.target.value);
                            }}
                            optionType="button"
                            buttonStyle="solid"
                          />
                        </div>
                      );
                    })
                  : ""
                : ""}
            </div>

            <Typography.Text>Số lượng:</Typography.Text>
            <div style={{ display: "flex", gap: 8, width: "100%" }}>
              {/* Số lượng */}
              <FormInputNumber
                min={1}
                max={50}
                onChange={onChange}
                value={soLuong}
              />
              <Button
                key={"1"}
                style={{
                  height: "34px",
                  backgroundColor: "var(--color-primary-5)",
                }}
                variant="solid"
                type="primary"
                onClick={() => {
                  handleThemGioHang("mua-ngay");
                }}
              >
                MUA NGAY
              </Button>
            </div>
            {/* button */}
            <Button
              key={"2"}
              style={{ height: "34px", width: "100%" }}
              onClick={() => handleThemGioHang("them-gio-hang")}
            >
              THÊM VÀO GIỎ HÀNG
            </Button>

            {/* Các phương thức thanh toán */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Image width={"30%"} src="/images/stripe.png" />
              <Image width={"30%"} src="/images/ZaloPay_Logo.png" />
              <Image width={"30%"} src="/images/COD.jpg" />
            </div>
          </div>
        </Splitter.Panel>

        <Splitter.Panel size={25}>

        </Splitter.Panel>
      </Splitter>

      {/* mô tả */}
      <Collapse
        items={[
          {
            key: "1",
            showArrow: false,
            label: "Mô tả sản phẩm",
            children: (
              <div>
                {dataDetail.length > 0
                  ? dataDetail[0].mo_ta
                  : "Chưa có dữ liệu"}
              </div>
            ),
          },
        ]}
        defaultActiveKey={["1"]}
      />

      {/* đánh giá */}
      <Collapse
        items={[
          {
            key: "1",
            showArrow: false,
            label: "Đánh giá",
            children: (
              <div>
                <List
                  itemLayout="vertical"
                  size="large"
                  pagination={{
                    onChange: (page) => {
                      console.log(page);
                    },
                    pageSize: 3,
                  }}
                  dataSource={danhGia}
                  renderItem={(item: any, index: number) => (
                    <List.Item key={item.title}>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                          />
                        }
                        title={item.ten_nguoi_dung}
                        description={
                          <Rate value={item.danh_gia_chat_luong} disabled />
                        }
                        children={
                          <Typography.Text>
                            {item.ten_nguoi_dung}
                          </Typography.Text>
                        }
                      />
                      {item.noi_dung_danh_gia}
                      {item.phan_hoi && ( // Kiểm tra nếu item.phan_hoi tồn tại
                        <div
                          style={{
                            marginTop: "10px",
                            paddingLeft: "20px",
                            borderLeft: "2px solid #ccc",
                          }}
                        >
                          <Typography.Text strong>Phản hồi:</Typography.Text>
                          <Typography.Paragraph>
                            {item.phan_hoi}
                          </Typography.Paragraph>
                        </div>
                      )}
                    </List.Item>
                  )}
                />
              </div>
            ),
          },
        ]}
        defaultActiveKey={["1"]}
        style={{ marginTop: "16px" }}
      />
    </div>
  );
};

export default ChiTietSanPham;
