import { Collapse, CollapseProps } from "antd";
import "./index.scss";
import React from "react";
import { CaretRightOutlined } from "@ant-design/icons";
import ButtonCustom from "../../components/button/button";

const SearchLayout: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  handleSearch?: (val:any)=> void;
}> = ({ children, style,handleSearch }) => {
  const itemsCollapse: CollapseProps["items"] = [
    {
      key: "1",
      label: "Tìm kiếm thông tin",
      children: (
        <div>
          <div style={{marginBottom:16,}}>{children}</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ButtonCustom
              text="Tìm kiếm"
              variant="solid"
              onClick={handleSearch}
            />
          </div>
        </div>
      ),
    },
  ];
  return (
    <Collapse
      className="search-layout"
      items={itemsCollapse}
      style={style}
      expandIcon={({ isActive }) => (
        <CaretRightOutlined rotate={isActive ? 90 : 0} />
      )}
    />
  );
};
export default SearchLayout;
