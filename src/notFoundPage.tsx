import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { routesConfig } from './routes/routes';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const handleBackPage = () => {
    // Add your back page logic here
    navigate(routesConfig.trangChu)
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Trang bạn truy cập không tồn tại"
      extra={<Button type="primary" onClick={handleBackPage}>Back Home</Button>}
    />
  );
};

export default NotFoundPage;