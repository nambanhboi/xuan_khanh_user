import { FunctionComponent, useEffect, useState } from "react";
import { Select, Form, Typography } from "antd";

interface Option {
  value: string|number;
  label: string;
}

type SelectComponentProps = {
  formItemName?:any;
  fromYear:number,
  label?: string;
  labelStyle?: any;
  placeholder?: string;
  value?: string | number | null | undefined;
  onChange?: (value: string | number | null | undefined) => void;
  style?: any;
  allowClear?: boolean;
  defaultCurrentYear?: boolean;
};

const FormSelectYear: FunctionComponent<SelectComponentProps> = ({
  formItemName,
  fromYear,
  label,
  labelStyle,
  placeholder,
  value,
  onChange,
  style,
  allowClear,
  defaultCurrentYear,
  ...rest
}) => {
  const [data, setData] = useState<Option[]>([])
  const [options, setOptions] = useState<any[]>([])
  useEffect(()=>{
    if(fromYear){
      const arr: any[] = [];
      for(let i=0;i<=(new Date()).getFullYear()-fromYear;i++) 
        arr.push({
          value:(new Date()).getFullYear()-i,
          label:(new Date()).getFullYear()-i
        });
      setOptions(arr);
    }
  }, [fromYear]);
  return (
    <Form.Item 
    name={formItemName}
    className="form-item">
      {label && <Typography.Text style={labelStyle || {fontSize:"16px"}}>{label}</Typography.Text>}
      <Select
        placeholder={placeholder}
        options={options}
        value={value}
        onChange={onChange}
        style={style}
        maxTagCount={'responsive'}
        allowClear={allowClear}
        defaultValue={defaultCurrentYear === true ? (new Date()).getFullYear() : null} // kg load dc lan 2
        {...rest}
      >
        {options && options?.map((option) => (
          <Select.Option
            key={typeof option.value === "boolean" ? (option.value ? 1 : 0) : option.value}
            value={option.value}
          >
          {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default FormSelectYear;
