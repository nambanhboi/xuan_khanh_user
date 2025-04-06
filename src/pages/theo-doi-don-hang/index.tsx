import { useEffect, useState } from 'react';
import { Table, Button, Modal, Typography, Timeline, Tag, Tooltip, Tabs, Rate, Input } from 'antd';
import { CloseCircleOutlined, EyeOutlined, StarOutlined, WarningOutlined } from '@ant-design/icons';
import './index.scss';
import TableCustom from '../../components/table/table-custom';
import { ChuyenTrangThaiDonHang, } from '../../services/DonHangServices';
import dayjs from "dayjs";
import ShowToast from '../../components/show-toast/ShowToast';
import TabPane from 'antd/es/tabs/TabPane';
import { DanhGia } from '../../services/DanhGia';
import { ConvertNumberToVND } from '../../config';

const { Title, Text } = Typography;

// Ánh xạ trạng thái đơn hàng (dựa trên trang_thai)
const statusMap: any = {
  1: 'Đã đặt hàng',
  2: 'Đang xử lý',
  3: 'Đang giao',
  4: 'Đã giao',
  5: "Đã hủy/Hoàn hàng/Hoàn tiền"
};

// Dữ liệu mẫu (có thể thay thế bằng dữ liệu từ API)

const OrderTrackingPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [wannaGetData, setWannaGetData] = useState<any>(null);
  const [isModalVisibleRate, setIsModalVisibleRate] = useState(false);
  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'ma_don_hang',
      key: 'ma_don_hang',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngay_mua',
      key: 'ngay_mua',
      render: (ngay_mua: any) => new Date(ngay_mua).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tong_tien',
      key: 'tong_tien',
      render: (tong_tien: any) => `${tong_tien.toLocaleString('vi-VN')} VNĐ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trang_thai',
      key: 'trang_thai',
      render: (trang_thai: any) => (
        <Tag color={trang_thai === 4 ? 'green' : 'orange'}>
          {statusMap[trang_thai] || 'Không xác định'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      dataIndex: "chiTietDonHangs",
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: "center"}}>
            <Tooltip title="Xem chi tiết">
              <EyeOutlined className='hover' style={{padding: "8px"}} onClick={() => handleViewDetails(record)} />
            </Tooltip>
            {record.trang_thai === 1 &&
            <Tooltip className='hover' title="Hủy đơn hàng">
              <CloseCircleOutlined style={{padding: "8px"}} onClick={() => handleCancelOrder(record.id)} />
            </Tooltip>
            }
            {record.trang_thai === 4 && !record.is_danh_gia && (
              <Tooltip title="Đánh giá đơn hàng">
                <StarOutlined className="hover" style={{ padding: "8px", color: "#fadb14" }} onClick={() => handleReview(record)} />
              </Tooltip>
            )}
          </div>
      )}
    },
  ];
  const handleReview = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisibleRate(true);
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };
  const handleCancelOrder = async (id: string) => {
    Modal.confirm({
      title: "Hủy đơn hàng",
      centered: true,
      icon: <WarningOutlined />,
      content: <p>Bạn chắc chắn muốn hủy đơn hàng</p>,
      className: "modal-custom danger",
      okButtonProps: {
        className: "btn btn-filled--danger",
      },
      cancelButtonProps: {
        className: "btn btn-outlined",
      },
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        await ChuyenTrangThaiDonHang(id, 5)
        .then(res => {
          ShowToast("success", "Thông báo", "Hủy đơn hàng thành công!");
          setIsModalVisible(false);
          setSelectedOrder(null);
          setWannaGetData(Math.random())
        })
        .catch(err => {
          ShowToast("error", "Thông báo", "Hủy đơn hàng không thành công!");
        })
      },
      onCancel: () => {},
    });
    
  };

  const generateTimeline = (currentStatus: number) => {
    const timelineItems = [];
    
    for (let statusCode = 1; statusCode <= currentStatus; statusCode++) {
      timelineItems.push(
        <Timeline.Item key={statusCode}>
          <Text strong>{statusMap[statusCode]}</Text>
          <br />
          {/* Assuming you want the current date/time for each step */}
          <Text>{statusCode === currentStatus ? dayjs().format('DD/MM/YYYY HH:mm') : ""}</Text>
        </Timeline.Item>
      );
    }
  
    return timelineItems;
  };
  const [activeTab, setActiveTab] = useState<string>("0");
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [productReviews, setProductReviews] = useState<any>({});
 
  const handleSubmitReview = async () => {
    // Sau khi nhấn "Gửi đánh giá", cập nhật thông tin đánh giá cho từng sản phẩm
    const updatedReviews = selectedOrder?.chiTietDonHangs.map((product: any) => {
      console.log("Đánh giá sản phẩm:", product);
      
      return ({
        id: product.id,
        rating: product.rating,
        reviewText: product.reviewText,
      })
    });

    console.log("Đánh giá sản phẩm:", updatedReviews);
    
    
    // Cập nhật lại biến productReviews
    setProductReviews({
      ...productReviews,
      [selectedOrder.id]: updatedReviews,
    });
    await DanhGia(selectedOrder.id, updatedReviews)
    .then(res => {      
      setIsModalVisibleRate(false);
      ShowToast("success", "Thông báo", "Đánh giá thành công!")
      setWannaGetData(Math.random())
    })
    .catch(err => {
      ShowToast("error", "Thông báo", "Đánh giá thất bại!")
    })

    // Đóng modal sau khi gửi đánh giá
  };

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      setWannaGetData(Math.random());
    }
  }, [activeTab]);

  useEffect(() => { 
    console.log("selectedOrder", selectedOrder);
    
  }
  , [selectedOrder]);
  return (
    <section className="order-tracking-page">
      {/* <Title level={2}>Theo dõi đơn hàng</Title> */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Tất cả" key="0" />
        <TabPane tab="Đã đặt hàng" key="1" />
        <TabPane tab="Đang xử lý" key="2" />
        <TabPane tab="Đang giao" key="3" />
        <TabPane tab="Đã giao" key="4" />
        <TabPane tab="Đã hủy/Hoàn hàng/Hoàn tiền" key="5" />
      </Tabs>
      <Modal
        title="Đánh giá sản phẩm"
        centered
        width={1200}
        visible={isModalVisibleRate}
        onOk={handleSubmitReview}
        onCancel={() => setIsModalVisibleRate(false)}
        okText="Gửi đánh giá"
        cancelText="Hủy"
      >
        {selectedOrder?.chiTietDonHangs?.map((product: any) => (
          <div key={product.id} style={{ marginBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            <Text strong>{product.ten_san_pham}</Text>
            <Rate
              value={product.rating || 0}
              onChange={(value) => {
                const updatedProducts = selectedOrder.chiTietDonHangs.map((p: any) =>
                  p.id === product.id ? { ...p, rating: value } : p
                );
                setSelectedOrder({ ...selectedOrder, chiTietDonHangs: updatedProducts });
              }}
            />
            <Input.TextArea
              rows={2}
              placeholder="Nhập nhận xét..."
              value={product.reviewText || ""}
              onChange={(e) => {
                const updatedProducts = selectedOrder.chiTietDonHangs.map((p: any) =>
                  p.id === product.id ? { ...p, reviewText: e.target.value } : p
                );
                setSelectedOrder({ ...selectedOrder, chiTietDonHangs: updatedProducts });
              }}
            />
          </div>
        ))}
      </Modal>

      <TableCustom
        columns={columns}
        rowKey="id"
        get_list_url={`/api/don-hang/get-don-hang-by-user?trang_thai=${activeTab}`}
        isEditOne={false}
        isDeleteOne={false}
        isViewDetail={false}
        isShowButtonAdd={false}
        isShowButtonEdit={false}
        add_button={false}
        export_button={false}
        delete_button={false}
        isCheckable={false}
        wan_get_data={wannaGetData}
      />

      {/* Modal chi tiết đơn hàng */}
      <Modal
        title={`Chi tiết đơn hàng ${selectedOrder?.ma_don_hang}`}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            {/* Thông tin đơn hàng */}
            <Text strong>Mã đơn hàng: </Text>
            <Text>{selectedOrder.ma_don_hang}</Text>
            <br />
            <Text strong>Ngày đặt: </Text>
            <Text>{dayjs(selectedOrder.ngay_mua).format('DD/MM/YYYY HH:mm')}</Text>
            <br />
            <Text strong>Tổng tiền: </Text>
            <Text>{ConvertNumberToVND(selectedOrder.tong_tien)}</Text>
            <br />
            <Text strong>Thành tiền: </Text>
            <Text>{ConvertNumberToVND(selectedOrder.thanh_tien)}</Text>
            <br />
            <Text strong>Số điện thoại: </Text>
            <Text>{selectedOrder.so_dien_thoai}</Text>
            <br />
            <Text strong>Địa chỉ: </Text>
            <Text>{selectedOrder.dia_chi}</Text>
            <br />
            <Text strong>Trạng thái: </Text>
            <Tag color={selectedOrder.trang_thai === 4 ? 'green' : 'orange'}>
              {statusMap[selectedOrder.trang_thai] || 'Không xác định'}
            </Tag>

            {/* Danh sách sản phẩm */}
            <Title level={4} style={{ marginTop: 20 }}>
              Sản phẩm
            </Title>
            <Table
              columns={[
                {
                  title: 'Tên sản phẩm',
                  dataIndex: 'ten_san_pham',
                  key: 'ten_san_pham',
                },
                { title: 'Số lượng', dataIndex: 'so_luong', key: 'so_luong' },
                {
                  title: 'Đơn giá',
                  dataIndex: 'don_gia',
                  key: 'don_gia',
                  render: (don_gia) => `${ConvertNumberToVND(don_gia) }`,
                },
                {
                  title: 'Thành tiền',
                  dataIndex: 'thanh_tien',
                  key: 'thanh_tien',
                  render: (thanh_tien) => `${ConvertNumberToVND(thanh_tien)}`,
                },
              ]}
              dataSource={selectedOrder.chiTietDonHangs}
              pagination={false}
              style={{ marginBottom: 20 }}
              rowKey="id"
            />

            {/* Timeline trạng thái giao hàng */}
            <Title level={4}>Trạng thái giao hàng</Title>
            <Timeline>
              {generateTimeline(selectedOrder.trang_thai)}
            </Timeline>

            {selectedOrder.trang_thai === 1 && (
              <div style={{textAlign: "center"}}>
                <Button
                  type="dashed"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  style={{ marginTop: 20 }}
                >
                  Hủy đơn hàng
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
};

export default OrderTrackingPage;