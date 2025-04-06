import React, { useEffect, useState } from "react";
import { Layout, Menu, Carousel, Card, Row, Col, Button, Spin, Typography, Collapse } from "antd";
import { BASE_URL } from "../../config/configApi";
import { GetAllDanhMucSanPham, GetAllSanPham } from "../../services/SanPham";
import "./index.scss";
import {
  ShoppingCartOutlined,
} from "@ant-design/icons";
const { Content } = Layout;
const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;


const TrangChu: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [totalProducts, setTotalProducts] = useState(0);
    
    const getSanPham = async (pageNumber: number, danhMucId: string) => {
        setLoading(true);
        try {
            const res = await GetAllSanPham(pageNumber, 10, danhMucId);
            setTotalProducts(res.data.total);
            if (pageNumber === 1) {
                setProducts(res.data.items);
            } else {
                setProducts(prev => [...prev, ...res.data.items]);
            }
        } catch (err) {
            console.error("Lỗi khi lấy sản phẩm", err);
        }
        setLoading(false);
    };

    const getDanhMucSanPham = async () => {
        try {
            const res = await GetAllDanhMucSanPham(1, 10);
            setCategories(res.data.items);
        } catch (err) {
            console.error("Lỗi khi lấy danh mục sản phẩm", err);
        }
    };

    useEffect(() => {
        getDanhMucSanPham();
        getSanPham(1, "");
    }, []);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        getSanPham(nextPage, selectedCategory);
    };

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setPage(1);
        getSanPham(1, categoryId);
    };


    const faqData = [
        {
          question: 'Thời gian giao hàng của cửa hàng là bao lâu?',
          answer: 'Chúng tôi giao hàng trong vòng 2-5 ngày làm việc trên toàn quốc. Đối với khu vực nội thành, thời gian giao hàng là 1-2 ngày.',
        },
        {
          question: 'Chính sách bảo hành sản phẩm như thế nào?',
          answer: 'Tất cả sản phẩm gia dụng đều được bảo hành từ 6 tháng đến 2 năm, tùy theo loại sản phẩm. Vui lòng giữ hóa đơn để được hỗ trợ bảo hành.',
        },
        {
          question: 'Tôi có thể đổi trả sản phẩm không?',
          answer: 'Có, bạn có thể đổi trả sản phẩm trong vòng 7 ngày nếu sản phẩm bị lỗi do nhà sản xuất. Vui lòng liên hệ hotline để được hỗ trợ.',
        },
      ];
      
      const paymentMethods = [
        'Thanh toán khi nhận hàng (COD)',
        'Chuyển khoản ngân hàng',
        'Thanh toán qua ví điện tử (Momo, ZaloPay)',
        'Thẻ tín dụng/thẻ ghi nợ',
      ];

    return (
        <Content style={{ background: "#fff", padding: "0" }}>
            {/* Header Banner */}
            <div className="header-banner" style={{ 
                position: "relative", 
                height: "100vh", 
                overflow: "hidden", 
                background: "linear-gradient(135deg, rgba(255, 245, 240, 0.9), rgba(255, 235, 230, 0.7))" // Gradient nền nhẹ nhàng
                }}>
                <img 
                    src="/images/banner.png" 
                    alt="Nước hoa cao cấp" 
                    style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover", 
                    opacity: 1 // Làm mờ ảnh nền để chữ nổi bật hơn
                    }} 
                />
                <div style={{
                    position: "absolute", 
                    top: "50%", 
                    left: "50%", 
                    transform: "translate(-50%, -50%)", 
                    textAlign: "center", 
                    color: "#fff",
                    padding: "20px",
                    background: "rgba(0, 0, 0, 0.2)", // Nền mờ nhẹ cho khu vực chữ
                    borderRadius: "15px"
                }}>
                    {/* Tiêu đề chính */}
                    <Title 
                    level={1} 
                    style={{ 
                        color: "#ff4d4f", // Màu đỏ nổi bật như trong hình
                        fontSize: "60px", 
                        fontWeight: "bold",
                        marginBottom: "10px",
                        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Hiệu ứng bóng đổ
                        letterSpacing: "2px",
                        textTransform: "uppercase"
                    }}
                    >
                    BIRTHDAY
                    </Title>

                    {/* Tiêu đề phụ */}
                    <Title 
                    level={3} 
                    style={{ 
                        color: "#fff", 
                        fontSize: "28px", 
                        fontWeight: "normal",
                        marginBottom: "20px",
                        textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)"
                    }}
                    >
                    TẶNG QUÀ SIÊU ĐỈNH
                    </Title>

                    {/* Mô tả */}
                    <Paragraph 
                    style={{ 
                        fontSize: "16px", 
                        color: "#fff", 
                        maxWidth: "600px", 
                        margin: "0 auto 20px", 
                        lineHeight: "1.6",
                        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)"
                    }}
                    >
                    Bộ sưu tập nước hoa cao cấp, chính hãng từ các thương hiệu hàng đầu thế giới. Đừng bỏ lỡ cơ hội nhận ưu đãi giảm đến 49%!
                    </Paragraph>

                    {/* Nút CTA */}
                    <Button 
                        type="primary" 
                        size="large" 
                        shape="round" 
                        style={{ 
                            background: "#d4a373", 
                            borderColor: "#d4a373", 
                            fontSize: "18px", 
                            padding: "10px 30px", 
                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", 
                            transition: "all 0.3s ease" 
                        }}
                        >
                        Mua sắm ngay
                        </Button>

                    {/* Tag khuyến mãi */}
                    <div style={{
                    position: "absolute",
                    top: "-40px",
                    left: "-60px",
                    background: "#ff4d4f",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    transform: "rotate(-20deg)",
                    fontSize: "18px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                    }}>
                    GIẢM ĐẾN 49%
                    </div>

                    {/* Tag quà tặng */}
                    <div style={{
                    position: "absolute",
                    top: "-40px",
                    right: "-60px",
                    background: "#ff4d4f",
                    color: "#fff",
                    padding: "10px 20px",
                    borderRadius: "10px",
                    transform: "rotate(20deg)",
                    fontSize: "18px",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)"
                    }}>
                    QUÀ 380K
                    </div>
                </div>
                </div>

            {/* Danh mục nổi bật */}
            <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>Danh mục nước hoa</Title>
            <Row gutter={[24, 24]} justify="center">
                {["Nữ", "Nam", "Unisex"].map((category, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                    <div 
                    style={{
                        position: "relative", 
                        height: "300px", 
                        background: `url(/images/category_${category.toLowerCase()}.jpg)`, 
                        backgroundSize: "cover", 
                        borderRadius: "10px", 
                        overflow: "hidden",
                        cursor: "pointer"
                    }}
                    onClick={() => handleCategoryClick(category)}
                    >
                    <div style={{
                        position: "absolute", 
                        top: "50%", 
                        left: "50%", 
                        transform: "translate(-50%, -50%)", 
                        color: "#fff", 
                        fontSize: "24px", 
                        fontWeight: "bold", 
                        textShadow: "0 2px 4px rgba(0,0,0,0.5)"
                    }}>
                        Nước hoa {category}
                    </div>
                    </div>
                </Col>
                ))}
            </Row>
            </section>

            {/* Sản phẩm nổi bật */}
            <section style={{ padding: "60px 20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>Sản phẩm nổi bật</Title>
            <Row gutter={[24, 24]}>
                {products.slice(0, 4).map(product => (
                <Col xs={24} sm={12} md={6} key={product.id}>
                    <Card
                    hoverable
                    cover={<img alt={product.ten_san_pham} src={`${BASE_URL}/${product.duongDanAnh}`} style={{ height: "300px", objectFit: "cover" }} />}
                    style={{ borderRadius: "10px", overflow: "hidden" }}
                    >
                    <Meta 
                        title={<span style={{ fontSize: "18px" }}>{product.ten_san_pham}</span>} 
                        description={<span style={{ fontSize: "16px", color: "#d4a373" }}>{product.gia}đ</span>} 
                    />
                    <Button 
                        type="link" 
                        style={{ padding: "10px 0", color: "#d4a373" }}
                        onClick={() => console.log(`Mua ${product.ten_san_pham}`)}
                    >
                        Thêm vào giỏ
                    </Button>
                    </Card>
                </Col>
                ))}
            </Row>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <Button type="default" size="large" onClick={handleLoadMore}>Xem thêm sản phẩm</Button>
            </div>
            </section>

            {/* Giới thiệu thương hiệu */}
            <section style={{ padding: "60px 20px", background: "#f9f9f9" }}>
            <Row gutter={[40, 40]} align="middle">
                <Col xs={24} md={12}>
                <img 
                    src="/images/brand_story.jpg" 
                    alt="Câu chuyện thương hiệu" 
                    style={{ width: "100%", borderRadius: "10px" }} 
                />
                </Col>
                <Col xs={24} md={12}>
                <Title level={2}>Hành trình hương thơm</Title>
                <Paragraph style={{ fontSize: "16px", lineHeight: "1.8" }}>
                    Chúng tôi mang đến những chai nước hoa được tuyển chọn kỹ lưỡng từ các nhà chế tác hàng đầu. Mỗi mùi hương là một câu chuyện, một cảm xúc, giúp bạn khẳng định phong cách riêng biệt.
                </Paragraph>
                <Button type="primary" shape="round" style={{ background: "#d4a373", borderColor: "#d4a373" }}>
                    Tìm hiểu thêm
                </Button>
                </Col>
            </Row>
            </section>

            {/* FAQ ngắn gọn */}
            <section style={{ padding: "60px 20px" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>Câu hỏi thường gặp</Title>
            <Collapse 
                bordered={false} 
                style={{ maxWidth: "800px", margin: "0 auto", background: "transparent" }}
            >
                {faqData.slice(0, 3).map((faq, index) => (
                <Panel header={faq.question} key={index} style={{ fontSize: "16px" }}>
                    <p>{faq.answer}</p>
                </Panel>
                ))}
            </Collapse>
            </section>
            </Content>
    );
}
export default TrangChu;