import { CaretDownOutlined, CloseOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Spin, TreeSelect, Typography, Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { axiosConfig } from "../../config/configApi";
type TreeDataNode = {
  label: string;
  value: string;
  children?: TreeDataNode[];
};
type TreeSelectProps = {
  itemRecord?: any;
  onChange?: (value: string | number | null | undefined)=> void;
  defaultValue?: string | number | null | undefined;
  treeData?: TreeDataNode[];
  value?: string | number | null | undefined;
  placeholder?: string;
  showCheckedStrategy?: "SHOW_CHILD" | "SHOW_PARENT" | "SHOW_ALL";
  label?: string;
  required?: boolean;
  labelStyle?: React.CSSProperties;
  treeCheckable?: boolean;
  style?: React.CSSProperties;
  treeDataApi?:string;
  filterFKState?: any;
  filterFK?: any;
  filterFKDefault?: any;
  labelField?: string;
  valueField?: string | number;
};

const TreeSelectCustom: React.FC<TreeSelectProps> = ({
  onChange,
  itemRecord,
  treeData,
  value,
  defaultValue,
  placeholder,
  showCheckedStrategy = "SHOW_ALL",
  label,
  required,
  labelStyle,
  treeCheckable = false,
  treeDataApi,
  filterFKState,
  filterFK,
  filterFKDefault,
  style,
  labelField = "ten",
  valueField = "id",
  ...rest
}) => {
  const [dataFromApi, setDataFromApi] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getDataOptions= () => {
    if (filterFK) {
      if (treeDataApi) {
        if (Array.isArray(filterFK)) {
          filterFK.forEach((fk: any, idx: number) => {
            if (filterFKState && filterFKState[idx] && Array.isArray(filterFKState[idx])) {
              // Nếu filterFKState là mảng, nối tất cả các label và value thành chuỗi theo kiểu "label = value"
              const lstValue = filterFKState[idx]?.map((x: any) => `${x.label}=${x.value ?? x ?? ''}`).join(',');
              treeDataApi = treeDataApi?.replaceAll("{" + fk?.replace('filter_', '') + "}", lstValue);
            }
            else {
              //Lộc fix thống kê dự báo xác suất
              treeDataApi += `&${fk?.replace('filter_', '')}=${filterFKState[idx]?.value ?? (filterFKDefault || '')}`;
            }
          });
        }
        else {
          if (filterFKState && Array.isArray(filterFKState)) {
            // Nếu filterFKState là mảng, nối tất cả các label và value thành chuỗi theo kiểu "label = value"
            const lstValue = filterFKState?.map(x => `${x.label}=${x.value ?? x ?? ''}`).join(',');
            treeDataApi = treeDataApi?.replaceAll("{" + filterFK?.replace('filter_', '') + "}", lstValue);
          }
          else {
            //Lộc fix thống kê dự báo xác suất
            treeDataApi += `&${filterFK?.replace('filter_', '')}=${filterFKState?.value ?? (filterFKDefault || '')}`;
          }
        }
      }
      else {

      }
    }

    setLoading(true);
    if(treeDataApi){
      axiosConfig.get(`${treeDataApi}?page_size=500`)
      .then((res:any)=> {
        const convertToTree = (data: any[]): TreeDataNode[] => {
          return data.map(item => ({
            label: item[labelField],
            value: item[valueField],
            children: item.children ? convertToTree(item.children) : []
          }));
        };
        const treeData = convertToTree(res.data.data);
        setDataFromApi(treeData);
      })
      .catch((err:any)=> {
        console.log(err);
      })
      .finally(()=> {
        setLoading(false);
      })
    }
  }

  useEffect(()=> {
    getDataOptions()
  },[treeDataApi, labelField, valueField, filterFKState])

  useEffect(() => {
      if (value === undefined || value === null) {
        if (defaultValue && onChange) onChange(defaultValue);
      }
    }, [])

  const handleClear = () => {
    onChange?.(undefined)
  }
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const onDropdownVisibleChange = (open: any) => {
    setDropdownOpen(open)
    if (open) {
      getDataOptions();
    }
  }

  return (
    <div className="form-tree-select-custom">
      <Typography.Text style={labelStyle || { fontSize: "16px" }}>
        {label}
        {required === true ? (
          <span
            className="required-star"
            style={{ color: "red", position: "relative" }}
          >
            {" "}
            *
          </span>
        ) : (
          ""
        )}
      </Typography.Text>
      {/*loading === true ? (
            <Skeleton.Input active={true} block/>
          ) :*/ <TreeSelect
        treeData={treeDataApi ? dataFromApi : treeData}
        value={value}
        onDropdownVisibleChange={onDropdownVisibleChange}
        onSelect={onChange}
        treeCheckable={treeCheckable}
        showCheckedStrategy={showCheckedStrategy}
        placeholder={placeholder}
        open={dropdownOpen}
        style={{
          width: "100%",
        }}
        allowClear={{ 
          clearIcon: <CloseOutlined className="clearContentIcon" onClick={handleClear} />,
        }}
        notFoundContent={loading ? <Spin size="small" /> : <Empty style={{ margin: "0 auto", padding: "0 auto", }} image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />}
        suffixIcon={
          <CaretDownOutlined
            style={{ cursor: "pointer" }}
          />
        }
      />}
    </div>
  );
};

export default TreeSelectCustom;
