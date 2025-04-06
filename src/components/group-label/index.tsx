import { Typography } from "antd";
import React from "react";
import "./index.scss";
type GroupLabelProps = {
  label?: string | React.ReactNode;
  style?: React.CSSProperties;
};

const GroupLabel: React.FC<GroupLabelProps> = ({ label, style }) => {
  return (
    <>
      <Typography.Text className="group-label-custom" style={style}>
        {label ?? "Group Label"}
      </Typography.Text>
    </>
  );
};

export default GroupLabel;
