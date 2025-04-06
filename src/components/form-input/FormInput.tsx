import { ChangeEvent, FunctionComponent, KeyboardEvent, ReactNode, useEffect, useRef } from "react";
import "./form-input.scss";
import { Input, Form, Typography } from "antd";
import { InputStatus } from "antd/es/_util/statusUtils";
import { CloseOutlined } from "@ant-design/icons";

type FormItemInputProps = {
  formItemName?: any;
  label?: string; 
  labelStyle?: any;
  prefixIcon?: ReactNode | string;
  afterPrefixIcon?: ReactNode;
  placeholder?: string;
  suffix?: ReactNode | string;
  readOnly?: boolean;
  value?: string | string[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  passwordInput?: boolean;
  onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  style?: any;
  status?: InputStatus;
  type?: string;
  required?: boolean;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  className?:string
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  prefix?: React.ReactNode;
  allowClear?: boolean | {clearIcon?: ReactNode} | undefined
  maxLength?: number; // Thêm thuộc tính maxLength
  valueRender?: any;
  fromRender?: boolean;
};

const FormItemInput: FunctionComponent<FormItemInputProps> = ({
  formItemName,
  label, // Nhận label từ props
  labelStyle,
  prefixIcon,
  afterPrefixIcon,
  placeholder,
  value,
  onChange,
  onKeyPress,
  disabled,
  readOnly,
  suffix,
  style = { marginBottom: "0px" },
  status,
  required = false,
  onBlur,
  autoFocus,
  className,
  onPaste,
  prefix,
  allowClear,
  maxLength,
  valueRender,
  fromRender,
  ...rest
}) => {

  const inputRef = useRef<any>(null);
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      //inputRef.current.focus();
    }
  }, [autoFocus]);

  // Hàm xử lý để loại bỏ khoảng trắng đầu cuối
  const handleChangeBlur = (e: ChangeEvent<HTMLInputElement>) => {
    const trimmedValue = e.target.value.trim();
    // Gọi hàm onChange nếu được truyền từ props
    if (onChange) {
      onChange({
        ...e,
        target: { ...e.target, value: trimmedValue },
      });
    }

    if(onBlur){
      onBlur(e)
    }
  };

  return (
    <Form.Item
      name={formItemName}
      className="form-item form-item-custom"
      required={required} // Set required to show the asterisk in the label
      rules={required ? [{ required: true, message: `${label} is required` }] : []}
    >
      <Typography.Text style={labelStyle || { fontSize: "16px" }}>{label}</Typography.Text>
{/*fromRender+' '+valueRender+' '+value*/}
      <Input
        prefix={prefix}
        onBlur={handleChangeBlur}
        disabled={disabled}
        addonBefore={prefixIcon}
        addonAfter={afterPrefixIcon}
        value={value}
        //value={fromRender === true ? valueRender : value}
        style={style}
        readOnly={readOnly}
        suffix={suffix}
        status={status}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        allowClear={allowClear ?? {
          clearIcon:<CloseOutlined className="clearContentIcon2" />
        }}
        required={required}
        autoFocus={autoFocus}
        ref={inputRef}
        onPaste={onPaste}
        maxLength={maxLength}
        {...rest}
        className={`form-input ${className ?? ''}`}
      />
    </Form.Item>
  );
};

export default FormItemInput;
