import {
  Spin,
  Typography,
  Checkbox,
  Table,
  Popconfirm,
  Affix,
  Button,
  Card,
} from "antd";
import React, { useEffect, useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { axiosConfig, BASE_URL } from "../../config/configApi";
import ShowToast from "../../components/show-toast/ShowToast";
import { jwtDecode, JwtPayload } from "jwt-decode";
import FormInputNumber from "../../components/form-input-number/FormInputNumber";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import { routesConfig } from "../../routes/routes";
interface CustomJwtPayload extends JwtPayload {
  id?: string; // hoặc number nếu `dvvc_id` là số
}

type ChiTietGioHangProps = {
  id?: string;
  gio_hang_id?: string;
  san_pham_id?: string;
  so_luong?: number | null;
  san_pham?: SanPhamProps;
  checked?: boolean; // Thêm trường checked
};
type SanPhamProps = {
  id?: string;
  danh_muc_id?: string;
  ma_san_pham?: string;
  ten_san_pham?: string;
  mo_ta?: string;
  xuat_xu?: string;
  luot_ban?: number;
  so_luong?: number;
  sku: string;
  mau_sac?: string;
  size?: string;
  duong_dan_anh_bia?: string;
  gia?: number;
  khuyen_mai?: number;
  is_active?: boolean;
};

const GioHang: React.FC = () => {
  const navigate = useNavigate();
  const [dataGioHang, setDataGioHang] = useState<ChiTietGioHangProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [auth, setAuth] = useState<any>();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      var user = jwtDecode<CustomJwtPayload>(JSON.parse(token).token);
      if (user) {
        setAuth(user);
        handleGetAllData(user.id);
      }
    }
  }, []);

  const handleGetAllData = (userId: any) => {
    setLoading(true);
    axiosConfig
      .get(`api/gio-hang/get-all?account_id=${userId}`)
      .then((res: any) => {
        const initialData = res.data.ds_chi_tiet_gio_hang.map(
          (item: ChiTietGioHangProps) => ({
            ...item,
            checked: false, // Thêm checked vào mỗi item
          })
        );
        setDataGioHang(initialData);
      })
      .catch((err: any) => {
        ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSelectAllChange = (e: any) => {
    const checked = e.target.checked;
    setSelectAll(checked);

    if (checked) {
      // Chọn tất cả các hàng
      const allSelectedRows = dataGioHang.map((item) => item); // Hoặc bạn có thể chỉ lấy id: dataGioHang.map((item) => item.id);
      setSelectedRows(allSelectedRows);
    } else {
      // Bỏ chọn tất cả các hàng
      setSelectedRows([]);
    }
  };

  const columns = [
    {
      title: (
        <Checkbox
          checked={selectAll}
          onChange={handleSelectAllChange}
        ></Checkbox>
      ),
      dataIndex: "checked",
      render: (checked: boolean, record: any, index: number) => (
        <Checkbox
          checked={selectedRows.some((row) => row.id === record.id)}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setSelectedRows((prevSelectedRows: any[]) => {
              if (isChecked) {
                // Thêm record từ dataGioHang (sử dụng dataGioHang)
                const selectedItem = dataGioHang.find(
                  (item) => item.id === record.id
                );
                if (
                  selectedItem &&
                  !prevSelectedRows.some((row) => row.id === record.id)
                ) {
                  return [...prevSelectedRows, selectedItem];
                }
                return prevSelectedRows;
              } else {
                // Xóa record khỏi selectedRows
                return prevSelectedRows.filter((row) => row.id !== record.id);
              }
            });
          }}
        />
      ),
      width: "5%",
    },
    {
      title: "Hình ảnh",
      dataIndex: "href",
      render: (href: string) => <img src={href} alt="product" width={"80%"} />,
      width: "15%",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "title",
      render: (title: any, record: any) => (
        <a
          style={{ fontSize: "16px" }}
          onClick={() => navigate(`/chi-tiet-san-pham/${record.ma_san_pham}`)}
        >
          {title}
        </a>
      ),
      width: "20%",
    },
    {
      title: "Giá",
      dataIndex: "description",
      render: (description: any) => (
        <div style={{ fontSize: "16px" }}>{description}</div>
      ),
      width: "15%",
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      render: (so_luong: number, record: any, index: number) => (
        <FormInputNumber
          style={{ width: "100%", fontSize: "16px" }}
          min={1}
          max={50}
          value={so_luong}
          onChange={(value) => {
            setLoading(true);
            const updatedData = [...dataGioHang];
            updatedData[index].so_luong = value;
            setDataGioHang(updatedData);
            axiosConfig
              .put(`api/gio-hang/edit`, {
                id: record.id,
                so_luong: value,
              })
              .then(() => {})
              .catch(() => {
                ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
                handleGetAllData(auth.id);
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        />
      ),
      width: "10%",
    },
    {
      title: "Biến thể",
      dataIndex: "san_pham",
      render: (san_pham: SanPhamProps) => (
        <div
          style={{
            fontSize: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {san_pham?.mau_sac ? `Màu: ${san_pham?.mau_sac}` : ""}
          {san_pham?.size ? `Màu: ${san_pham?.size}` : ""}
        </div>
      ),
      width: "10%",
    },
    {
      title: "Hành động",
      render: (record: any, data: any, index: number) => (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{
              style: { backgroundColor: "var(--color-primary-5)" },
            }}
            onConfirm={() => {
              setLoading(true);
              axiosConfig
                .delete(`api/gio-hang/delete?id=${record.id}`)
                .then(() => {
                  handleGetAllData(auth.id);
                })
                .catch(() => {
                  ShowToast("error", "Thông báo", "Có lỗi xảy ra", 3);
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            <div className="btn-delete">
              <DeleteOutlined />
            </div>
          </Popconfirm>
        </div>
      ),
      width: "7%",
    },
  ];

  const dataSource = dataGioHang.map((item: any, i: number) => ({
    key: i.toString(),
    id: item.id,
    ma_san_pham: item.san_pham.ma_san_pham,
    href: `${BASE_URL}/${item.san_pham.duong_dan_anh_bia}`,
    title: <div style={{ fontSize: "16px" }}>{item.san_pham.ten_san_pham}</div>,
    description: (
      <div style={{ fontSize: "16px" }}>
        {item.san_pham.khuyen_mai ? (
          <div>
            <Typography.Text delete style={{ fontSize: "16px" }}>
              {(item.so_luong * item.san_pham.gia).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Typography.Text>{" "}
            <Typography.Text style={{ fontSize: "16px" }}>
              {(item.so_luong * item.san_pham.khuyen_mai).toLocaleString(
                "vi-VN",
                {
                  style: "currency",
                  currency: "VND",
                }
              )}
            </Typography.Text>
          </div>
        ) : (
          (item.so_luong * item.san_pham.gia).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        )}
      </div>
    ),
    so_luong: item.so_luong,
    san_pham: item.san_pham,
    checked: item.checked,
  }));

  const tinhTongTienGioHang = (gioHang: any[]) => {
    let tongTien = 0;

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

    return tongTien.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    console.log(selectedRows);
    
  }, [selectedRows]);
  return (
    <div className="gio-hang-chi-tiet">
      <Spin spinning={loading}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey="key"
          pagination={false}
        />
        <Affix offsetBottom={10}>
          <Card style={{ backgroundColor: "var(--color-primary-5)" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="gio-hang-trai">
                <Checkbox
                  onClick={handleSelectAllChange}
                  style={{ color: "white", fontSize: "16px" }}
                >
                  Chọn tất cả
                </Checkbox>
              </div>
              <div className="gio-hang-phai">
                <Typography.Text style={{ color: "white", fontSize: "16px" }}>
                  Tổng cộng ({selectedRows.length} sản phẩm):{" "}
                </Typography.Text>
                <Typography.Text style={{ color: "white", fontSize: "20px" }}>
                  {tinhTongTienGioHang(selectedRows)}
                </Typography.Text>
                <Button
                  onClick={() => {
                    if(selectedRows.length === 0) {
                      ShowToast("warning", "Thông báo", "Vui lòng chọn sản phẩm để thanh toán", 3);
                      return;
                    }
                    navigate(routesConfig.thanhToan, { state: selectedRows });
                  }}
                >
                  THANH TOÁN
                </Button>
              </div>
            </div>
          </Card>
        </Affix>
      </Spin>
    </div>
  );
};

export default GioHang;
