import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { Form, Typography, Tabs } from "antd";

interface Option {
  value: string|number;
  label: string;
}

type TabComponentProps = {
  formItemName?:any,
  label?: string;
  labelStyle?: any;
  options?: { value: string | number | boolean; label: string | ReactNode }[]; // Array of options with value and label
  value?: string | number | null | undefined;
  onChange?: (value: string | number | boolean | null | undefined) => void;
  disabled?: boolean;
  style?: any;
  defaultValue?: string | number | null | undefined;
};

const FormTab: FunctionComponent<TabComponentProps> = ({
  formItemName,
  label,
  labelStyle,
  options,
  value,
  onChange,
  disabled,
  style,
  defaultValue,
  ...rest
}) => {
  const [data, setData] = useState<Option[]>([])
  const getDataOptions = async (searchValue?:string) => {
    setData([]);
  }

  const [tab, setTab] = useState<string>('1');
  const [itemsTab, setItemsTab] = useState([]);
  useEffect(() => {
    const tabs: any = options ? options?.map((tab: any, tabPosition: number) => {
      if (tab === null) return;
      const idx = tabPosition;
      return {
        key: (idx + 1) + '',
        label: `${tab.label}`,
        children: <div className={`tab-${idx}`} key={`tab-${idx}`}></div>,
      };
    }) : [];
    setItemsTab(tabs);
  }, [options]);

  const onChangeTab = (key: string) => {
    const value = options?.[parseInt(key)-1].value;
    if(onChange) onChange(value);
    setTab(key);
  };

  useEffect(()=> {
    if(value === undefined || value === null) {
      if(defaultValue && onChange) {
        options?.map((tab: any, tabPosition: number) => {
          if(tab.value + '' === defaultValue + '') {
            onChange(defaultValue);
            setTab((tabPosition + 1) + '');
            onChangeTab((tabPosition + 1) + '');
          }
        });
      }
    }
    else {
      options?.map((tab: any, tabPosition: number) => {
        if(tab.value + '' === value + '') {
          if(onChange) onChange(value);
          setTab((tabPosition + 1) + '');
          onChangeTab((tabPosition + 1) + '');
        }
      });
    }
  }, [])

  return (
    <Form.Item 
    name={formItemName}
    className="form-item">
      {label && <Typography.Text style={labelStyle || {fontSize:"16px"}}>{label}</Typography.Text>}
      
      <Tabs
        items={itemsTab}
        activeKey={tab}
        onChange={onChangeTab}
      />
      
    </Form.Item>
  );
};

export default FormTab;
