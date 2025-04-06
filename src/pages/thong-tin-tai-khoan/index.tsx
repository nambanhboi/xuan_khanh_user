import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Typography, Divider, Modal, Form, Input, message } from 'antd';
import { getDetailAcc, UpdatePassword, UpdateUser } from '../../services/AuthenServices';
import FormSelect from '../../components/form-select/FormSelect';
import DatePickerCustomOld from '../../components/datepicker/DatePickerCustomOld';
import "./index.scss";
const { Title, Text } = Typography;

interface BankAccount {
  id: string;
  ten_tai_khoan: string;
  so_tai_khoan: string;
  ten_ngan_hang: string;
  so_the: string;
  is_default: boolean;
}

interface AccountData {
    ten: string;
    ngay_sinh: string;
    dia_chi: string;
    gioi_tinh: boolean;
    so_dien_thoai: string;
    email: string;
}

const AccountInfo: React.FC = () => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState<boolean>(false);

  const [passwordForm] = Form.useForm();

  // Hàm lấy dữ liệu tài khoản
  const getData = async () => {
    setLoading(true);
    await getDetailAcc()
      .then((response) => {
        setAccountData(response.data);
      })
      .catch((error) => {
        message.error('Không thể lấy thông tin tài khoản. Vui lòng thử lại sau.');
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);


  // Hàm mở modal cập nhật mật khẩu
  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

 

  // Hàm đóng modal
  const handleCancel = () => {
    setIsPasswordModalVisible(false);
    setIsModalVisible(false);
    // Reset form tương ứng khi đóng modal
    passwordForm.resetFields();
    form.resetFields();
  };


  // Hàm cập nhật mật khẩu
  const handleUpdatePassword = async (values: { oldPassword: string; newPassword: string }) => {
    const postData = {
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    };
    await UpdatePassword(postData)
      .then((response) => {
        message.success('Cập nhật mật khẩu thành công!');
        handleCancel();
      })
      .catch((error) => {
        message.error('Cập nhật mật khẩu thất bại. Vui lòng thử lại.');
        console.error(error);
      });
  };

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleUpdateInfo = () => {
    setIsModalVisible(true);
    form.setFieldsValue(accountData); // Điền dữ liệu hiện tại vào form
  };


  const handleUpdate = async (values: any) => {
    console.log(values)
      await UpdateUser(values)
        .then((response) => {
            if(response)
                message.success('Cập nhật thông tin thành công!');
                handleCancel();
                getData();
        })
        .catch((error) => {
            message.error('Cập nhật thông tin thất bại. Vui lòng thử lại.');
            console.error(error);
        });

  };

  return (
      <>
        <Card
            style={{
            maxWidth: 600,
            margin: '20px auto',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
        >
        <Divider orientation="left">Thông tin tài khoản 
        <Button type="default" onClick={handleUpdateInfo} style={{marginLeft: "34px"}}>
                Cập nhật thông tin
            </Button>
        </Divider>

        {/* Họ tên */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Họ và tên</Text>
            <br />
            <Text>{accountData?.ten ?? 'Chưa có dữ liệu'}</Text>
            </Col>
        </Row>

        {/* Số điện thoại */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Số điện thoại</Text>
            <br />
            <Text>{accountData?.so_dien_thoai ?? 'Chưa có dữ liệu'}</Text>
            </Col>
        </Row>

        {/* Email */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Email</Text>
            <br />
            <Text>{accountData?.email ?? 'Chưa có dữ liệu'}</Text>
            </Col>
        </Row>

        {/* Ngày sinh */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Ngày sinh</Text>
            <br />
            <Text>{accountData?.ngay_sinh ?? "Chưa có dữ liệu" }</Text>
            </Col>
        </Row>

        {/* Giới tính */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Giới tính</Text>
            <br />
            <Text>{accountData?.gioi_tinh == null ? "Chưa có dữ liệu" : accountData.gioi_tinh ? "Nam" : "Nữ"}</Text>
            </Col>
        </Row>

        {/* Địa chỉ */}
        <Row
            justify="space-between"
            align="middle"
            style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
            <Col>
            <Text strong>Địa chỉ</Text>
            <br />
            <Text>{accountData?.dia_chi ?? 'Chưa có dữ liệu'}</Text>
            </Col>
        </Row>

      {/* Modal chỉnh sửa thông tin */}
      <Modal
        title="Chỉnh sửa thông tin cá nhân"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        className='modal-edit-info'
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          {/* Họ và tên */}
          <Form.Item
            name="ten"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          {/* Số điện thoại */}
          <Form.Item
            name="so_dien_thoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ!' }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          {/* Ngày sinh */}
          <Form.Item
            name="ngay_sinh"
            label="Ngày sinh"
            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
          >
            <DatePickerCustomOld
                format="YYYY-MM-DD"
                style={{ width: '100%' }}
                placeholder="Chọn ngày sinh"
                mode='date'
                />  
          </Form.Item>

          {/* Giới tính */}
          <Form.Item
            name="gioi_tinh"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
          >
            <FormSelect label="Giới tính" style={{ width: '100%' }} 
                options={[
                    {label: "Nam", value: true},
                    {label: "Nữ", value: false},
                ]}
                selectType='normal'
                placeholder='Chọn giới tính'
                />
          </Form.Item>

          {/* Địa chỉ */}
          <Form.Item
            name="dia_chi"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          {/* Nút Lưu */}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Lưu
            </Button>
          </Form.Item>
        </Form>
                </Modal>
        {/* Mật khẩu đăng nhập */}
        <Row
          justify="space-between"
          align="middle"
          style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}
        >
          <Col>
            <Text strong>Mật khẩu đăng nhập</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Nhấn nút: Bạn nên thường xuyên thay đổi mật khẩu để tránh các sự cố về vấn đề bảo mật
            </Text>
          </Col>
          <Col>
            <Button type="default" onClick={showPasswordModal}>
              Cập nhật
            </Button>
          </Col>
        </Row>

        

        <Divider />
        </Card>

        {/* Modal cập nhật mật khẩu */}
        <Modal
            title="Cập nhật mật khẩu"
            open={isPasswordModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form form={passwordForm} onFinish={handleUpdatePassword}>
            <Form.Item
                name="oldPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ!' }]}
            >
                <Input.Password placeholder="Nhập mật khẩu cũ" />
            </Form.Item>
            <Form.Item
                name="newPassword"
                rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                { min: 6, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' },
                ]}
            >
                <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
                name="confirmNewPassword"
                dependencies={['newPassword']}
                rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                }),
                ]}
            >
                <Input.Password placeholder="Xác nhận mật khẩu mới" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                Lưu
                </Button>
            </Form.Item>
            </Form>
        </Modal>
      </>
  );
};

export default AccountInfo;