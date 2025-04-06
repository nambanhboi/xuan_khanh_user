import React from 'react';
import { Result, Button, Typography, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { routesConfig } from '../../routes/routes';

const { Title, Paragraph } = Typography;

const ThanhToanThanhCong = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Điều hướng về trang chủ
    };

    const handleViewOrder = () => {
        navigate(routesConfig.theoDoiDonHang); // Điều hướng đến trang đơn hàng
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <Result
                icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} />}
                title={<Title level={3}>Thanh toán thành công!</Title>}
                subTitle={
                    <Paragraph>
                        Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.
                    </Paragraph>
                }
                extra={
                    <Space>
                        <Button type="primary" size="large" onClick={handleGoHome}>
                            Trở về trang chủ
                        </Button>
                        <Button size="large" onClick={handleViewOrder}>
                            Xem đơn hàng
                        </Button>
                    </Space>
                }
            />
        </div>
    );
};

export default ThanhToanThanhCong;