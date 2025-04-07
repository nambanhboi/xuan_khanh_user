import {
  Avatar,
  Badge,
  Button,
  Card,
  Image,
  Pagination,
  PaginationProps,
  Radio,
  Select,
  Slider,
  Spin,
  Splitter,
  Tag,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { axiosConfig, BASE_URL } from "../../config/configApi";
import ShowToast from "../../components/show-toast/ShowToast";
import "./index.scss";
import {
  EditOutlined,
  EllipsisOutlined,
  FilterOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import FormItemInput from "../../components/form-input/FormInput";
import FormSelect from "../../components/form-select/FormSelect";
import { SliderSingleProps } from "antd/lib";
import { SliderRangeProps } from "antd/es/slider";
import ButtonCustom from "../../components/button/button";
import { useNavigate, useParams } from "react-router-dom";
import GroupLabel from "../../components/group-label";

const CuaHang: React.FC = () => {
  const [sizes, setSizes] = React.useState<(number | string)[]>([20, 80]);
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);
  const [total, setTotal] = useState<number>(1);
  const [ProductsData, setProductsData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [khoang_tien, set_khoang_tien] = useState<number[]>([20000, 10000000]);
  const [danh_muc, set_danh_muc] = useState<string | null>(null);
  const [tu_khoa, set_tu_khoa] = useState<string | string[] | undefined>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  //phân trang
  const onChange: PaginationProps["onChange"] = (page) => {
    setPageIndex(page);
  };
  //get tất cả sản phẩm lần đầu
  useEffect(() => {
    setLoading(true);
    axiosConfig
      .get(`api/DanhSachSanPham/get-all`, {
        params: {
          pageSize: pageSize,
          pageNumber: pageIndex,
          danh_muc_id: id ? id : null,
        },
      })
      .then((res: any) => {
        setProductsData(res.data.items);
        setTotal(res.data.totalRecord);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pageIndex, id]);

  const handleSearch = () => {
    setLoading(true);
    axiosConfig
      .get(`api/DanhSachSanPham/get-all`, {
        params: {
          pageSize: pageSize,
          pageNumber: 1,
          danh_muc_id: danh_muc,
          keySearch: tu_khoa,
          khoang_gia_tu: khoang_tien[0],
          khoang_gia_den: khoang_tien[1],
        },
      })
      .then((res: any) => {
        // console.log(res.data.items);
        setProductsData(res.data.items);
        setTotal(res.data.totalRecord);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleSearch();
  }, [khoang_tien]);
  const handleClickProduct = (item: any) => {
    navigate(`/chi-tiet-san-pham/${item.ma_san_pham}`);
  };

  const formatter: NonNullable<SliderRangeProps["tooltip"]>["formatter"] = (
    value
  ) =>
    `${value?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}`;
  return (
    <div className="ds-san-pham">
      <Spin spinning={loading}>
        <Splitter
          style={{
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            minHeight: "75vh",
          }}
          onResize={setSizes}
        >
          {/* <Splitter.Panel
            collapsible
            size={sizes[0]}
            resizable={false}
            className="Splitter-left"
          >
            <div className="Splitter-left-content">
              <Typography.Title level={3} className="Title" style={{color: "var(--color-primary-8)"}}>
                <FilterOutlined /> Lọc sản phẩm
              </Typography.Title>

              <FormItemInput
                label="Tìm kiếm"
                placeholder="Nhập từ khóa"
                value={tu_khoa}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  set_tu_khoa(e.target.value);
                }}
              />

              <FormSelect
                selectType="selectApi"
                label={"Danh mục"}
                src="api/DanhMucSanPham/get-all"
                valueField={"id"}
                labelField="ten_danh_muc"
                allOptionLabel="Tất cả"
                value={danh_muc}
                onChange={set_danh_muc}
              />

              <div>
                <Typography.Text style={{ fontSize: "16px" }}>
                  Giá
                </Typography.Text>
                <Slider
                  range
                  min={20000}
                  max={10000000}
                  step={10000}
                  value={khoang_tien}
                  tooltip={{ formatter }}
                  onChange={set_khoang_tien}
                />
              </div>

              <ButtonCustom text="Tìm kiếm" onClick={handleSearch} />
            </div>
          </Splitter.Panel> */}

          <Splitter.Panel size={sizes[1]} className="Splitter-right">
            <Typography.Title level={3} className="Title">
              <GroupLabel label="Kết quả tìm kiếm" />
            </Typography.Title>
            <div
              className="filter-selects"
              style={{ display: "flex", gap: "10px", padding: "8px 15px" }}
            >
              <Radio.Group
                onChange={(e: any) => {
                  const value = e.target.value;
                  if (value === "duoi-2-trieu") {
                    set_khoang_tien([0, 2000000]);
                  } else if (value === "2-4-trieu") {
                    set_khoang_tien([2000000, 4000000]);
                  } else if (value === "tren-4-trieu") {
                    set_khoang_tien([4000000, 10000000]);
                  }
                }}
                optionType="button"
                buttonStyle="solid"
              >
                <Radio.Button value="duoi-2-trieu">DƯỚI 2 TRIỆU</Radio.Button>
                <Radio.Button value="2-4-trieu">2 - 4 TRIỆU</Radio.Button>
                <Radio.Button value="tren-4-trieu">TRÊN 4 TRIỆU</Radio.Button>
              </Radio.Group>
            </div>
            <div className="Splitter-right-content">
              {ProductsData.map((item: any) => {
                return item.khuyen_mai ? (
                  <Badge.Ribbon
                    text="SALE"
                    style={{ marginTop: "10px" }}
                    color="red"
                  >
                    <Card
                      hoverable
                      onClick={() => handleClickProduct(item)}
                      style={{
                        width: 250,
                        border: "1px solid rgb(214, 214, 214)",
                      }}
                      cover={
                        <Image
                          preview={false}
                          alt="example"
                          style={{ border: "1px solid rgb(214, 214, 214)" }}
                          src={`${BASE_URL}/${item.duongDanAnh}`}
                        />
                      }
                      // actions={[
                      //   <ShoppingCartOutlined key="cart" className="cart-icon" />,
                      // ]}
                    >
                      <div className="mo-ta-san-pham">
                        <Typography.Text className="ten-san-pham">
                          <Tag color="red" className="ten-danh-muc">
                            {item.ten_danh_muc}
                          </Tag>
                          {item.ten_san_pham}
                        </Typography.Text>

                        <div>
                          {item.khuyen_mai ? (
                            <Typography.Text delete className="gia-san-pham">
                              {item.gia.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}{" "}
                              <span></span>
                            </Typography.Text>
                          ) : (
                            <Typography.Text className="gia-san-pham">
                              {item.gia.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography.Text>
                          )}
                          {item.khuyen_mai ? (
                            <Typography.Text
                              className="khuyen-mai"
                              style={{ marginLeft: "5px" }}
                            >
                              {item.khuyen_mai.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </Typography.Text>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </Card>
                  </Badge.Ribbon>
                ) : (
                  <div>
                  <Card
                    hoverable
                    onClick={() => handleClickProduct(item)}
                    style={{
                      width: 250,
                      border: "1px solid rgb(214, 214, 214)",
                    }}
                    cover={
                      <Image
                        preview={false}
                        alt="example"
                        style={{ border: "1px solid rgb(214, 214, 214)" }}
                        src={`${BASE_URL}/${item.duongDanAnh}`}
                      />
                    }
                    // actions={[
                    //   <ShoppingCartOutlined key="cart" className="cart-icon" />,
                    // ]}
                  >
                    <div className="mo-ta-san-pham">
                      <Typography.Text className="ten-san-pham">
                        <Tag color="red" className="ten-danh-muc">
                          {item.ten_danh_muc}
                        </Tag>
                        {item.ten_san_pham}
                      </Typography.Text>

                      <div>
                        {item.khuyen_mai ? (
                          <Typography.Text delete className="gia-san-pham">
                            {item.gia.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}{" "}
                            <span></span>
                          </Typography.Text>
                        ) : (
                          <Typography.Text className="gia-san-pham">
                            {item.gia.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Typography.Text>
                        )}
                        {item.khuyen_mai ? (
                          <Typography.Text
                            className="khuyen-mai"
                            style={{ marginLeft: "5px" }}
                          >
                            {item.khuyen_mai.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}
                          </Typography.Text>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </Card>
                  </div>
                );
              })}
            </div>
            <Pagination
              size="default"
              total={total}
              align="end"
              current={pageIndex}
              pageSize={pageSize}
              onChange={onChange}
            />
          </Splitter.Panel>
        </Splitter>
      </Spin>
    </div>
  );
};
export default CuaHang;
