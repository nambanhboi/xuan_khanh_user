import { FunctionComponent, useEffect, useState } from "react";
import { ConfigProvider, DatePicker, Typography, theme } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/vi';
import viVN from "antd/lib/locale/vi_VN";
import ShowToast from "../show-toast/ShowToast";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import './datepicker-custom.scss';
import { CloseOutlined } from "@ant-design/icons";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('vi');
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

//gio tren picker = 10h       Tue Oct 08 2024 13:09:49 GMT+0700 (Indochina Time) {}
//gio tra ve js = 10-7 => call api +7h

type DatePickerComponentProps = {
  label?: string;
  placeholderRange?: string[],
  placeholder?: string;
  value?: Dayjs | [Dayjs, Dayjs] | null; // Single or Range date picker value
  filterValue?: Dayjs | [Dayjs, Dayjs] | null; // Single or Range date picker value
  selectedValues?: Dayjs[]; // Single or Range date picker value
  handleChangeMonthYear?: Function;
  onChange?: Function;// DatePickerProps["onChange"] | RangePickerProps["onChange"]; // Change handler for single or range
  disabled?: boolean;
  style?: any;
  format?: string; // Date format (e.g., "YYYY-MM-DD")
  picker?: "week" | "month" | "quarter" | "year";
  mode?: "date" | "range"; // Mode for date or range selection
  allowClear?: boolean;
  defaultValue?: Dayjs;
  limit?: number | null;
  onlyDate?: boolean;
  onlyHour?: boolean;
  onlyMinute?: boolean;
  showTime?: any;
  required?: boolean;
  limitRange?: number |null
  className?:string;
};

const { RangePicker } = DatePicker;

const DatePickerCustom: FunctionComponent<DatePickerComponentProps> = ({
  label,
  placeholderRange = ["Bắt đầu", "Kết thúc"],
  placeholder,
  value,
  filterValue,
  selectedValues,
  handleChangeMonthYear,
  onChange,
  disabled,
  style,
  format = "DD/MM/YYYY", // Default format
  mode = "date", // Default to single date picker
  allowClear = true,
  defaultValue,
  limit,
  limitRange,
  onlyDate = true,
  onlyHour,
  onlyMinute,
  picker,
  showTime,
  required,
  className,
  ...rest
}) => {
  placeholderRange = ["Bắt đầu", "Kết thúc"];

  const onCalendarChange = (dates: any, dateStrings: any, info: any) => {
    // //info.range === 'end'
    // if (dates && dates != null) {
    //   const [start, end] = dates;
    //   if (start && end && start > end) {
    //     //debugger
    //     //ShowToast('error', `Thông báo`,`Khi chọn, ngày kết thúc phải lớn hơn ngày bắt đầu`, 6);
    //   }
    // }

    if (dates && dates[0] && dates[1]) {
      // Chỉ lưu khi cả start và end đều đã chọn
      const updatedDates = [
        dates[0].add(7, 'h').tz('Asia/Ho_Chi_Minh').local(),
        dates[1].add(7, 'h').tz('Asia/Ho_Chi_Minh').local(),
      ];
      const [start, end] = updatedDates;
  
      if (limit && end.diff(start, 'day') > limit) {
        ShowToast('error', `Thông báo`, `Khoảng thời gian tối đa có thể chọn là ${limit} ngày`, 6);
      } else {
        onChange?.(updatedDates, [start.format(format), end.format(format)]);
      }
    }
  }
  const onRangeChange = (dates: any) => {
    
    if (dates && dates != null) {
      if (dates[0]) dates[0] = dates[0].add(7, 'h').tz('Asia/Ho_Chi_Minh').local();
      if (dates[1]) dates[1] = dates[1].add(7, 'h').tz('Asia/Ho_Chi_Minh').local();
      const [start, end] = dates;
      const diff = end.diff(start, 'day'); // Tính số ngày

      if (picker === undefined) {
        if (limit && diff > limit) {
          dates[1] = dates[0];
          ShowToast('error', `Thông báo`, `Khoảng thời gian tối đa có thể chọn là ${limit} ngày`, 6);
          onChange?.(start, [start, start])
        }
        else {
          if (onChange) {
            onChange(dates, [start.format(format), end.format(format)]);
          }
        }
      }
      else {
        if (onChange) {
          onChange(dates, [start.format(format), end.format(format)]);
        }
      }
    }
    else {
      if (onChange) {
        onChange(null as any, null as any); // Set null nếu không có dates
      }
    }
  }

  const onSingleChange = (dates: any) => {
    if (dates && dates != null) {
      if (dates) dates = dates.add(7, 'h').tz('Asia/Ho_Chi_Minh').local();
      if (picker === undefined) {
        if (onChange) {
          setCurrentViewDate(dates.add(-7, 'h').tz('Asia/Ho_Chi_Minh').local());
          onChange(dates, dates.format(format));
        }
      }
      else {
        if (onChange) {
          setCurrentViewDate(null);
          onChange(null as any, null as any); // Set null nếu không có dates
        }
      }
    }
    else{
      setCurrentViewDate(null); // Ví dụ: cập nhật state
      onChange?.(null, "");
    }
  }

  const getVN2Utc0 = (date: Dayjs) => {
    //date
    try {
      if (!date || date.format('HHmmss') === '000000') return date;
      else return date.add(-7, 'h');
    }
    catch {
      return date;
    }
  }
  if (onlyHour === true) require('./datepicker-only-hour.scss');
  if (onlyMinute === true) require('./datepicker-only-minute.scss');

  if (JSON.stringify(filterValue) !== JSON.stringify(value) && mode === 'range') value = filterValue; // value theo instance cu

  const [isOpen, setIsOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);

  const handleOpenChange = (open: any) => {
    setIsOpen(open);
  };

  useEffect(() => {
    const handleDayClick = (event: any) => {
      // Check if the click is on a day cell within the DatePicker's panel
      const dayCell = event.target.closest('.ant-picker-cell-inner');
      const monthCell: any = document.querySelectorAll('.ant-picker-date-panel .ant-picker-month-btn');
      const yearCell: any = document.querySelectorAll('.ant-picker-date-panel .ant-picker-year-btn');
      if (dayCell && isOpen) {
        const current = dayjs(monthCell[0].innerText.replace('Th', '') + '/' + dayCell.innerText + '/' + yearCell[0].innerText);
        if (selectedValues)
          setSelectedHours(selectedValues?.filter((d: Dayjs) => d.format("DD/MM/YYYY") === current?.format("DD/MM/YYYY")).map((d: Dayjs) => d.hour()));
        onChange?.(null, [null, null])
      }
    };
    if (isOpen) {
      // Add event listener for clicks on days when panel is open
      document.addEventListener('click', handleDayClick);
    } else {
      // Remove event listener when panel is closed
      document.removeEventListener('click', handleDayClick);
    }
    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleDayClick);
    };
  }, [isOpen]);

  const [currentViewDate, setCurrentViewDate] = useState<Dayjs | null>(value ? getVN2Utc0(value as Dayjs) : null);
  const [debugstr, setDebugstr] = useState<any>(null);

  const handlePanelChange = (date: Dayjs, mode: any) => {
    //setDebugstr(date?.format('DD/MM')+ ' '+currentViewDate?.format('DD/MM')+' '+value?.format('DD/MM'))
    handleChangeMonthYear?.(date.add(7, 'h').tz('Asia/Ho_Chi_Minh').local(), 'M');
    setCurrentViewDate(date);
    onChange?.(null, [null, null])
  };

  const { token } = theme.useToken();

  const style2: React.CSSProperties = {
    border: `1px solid ${token.colorPrimary}`,
    borderRadius: '50%',
    //backgroundColor: 'yellow',
  };
  const cellRender: DatePickerProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date' && info.type !== 'time') {
      return info.originNode;
    }
    if (info.type === 'date') {
      if (typeof current === 'number' || typeof current === 'string') {
        return <div className="ant-picker-cell-inner">{current}</div>;
      }
      if (selectedValues && selectedValues?.filter((d: Dayjs) => d.format("DD/MM/YYYY") === current?.format("DD/MM/YYYY")).length > 0)
        return (
          <div className="ant-picker-cell-inner"
            style={style2}
            title={selectedValues?.filter((d: Dayjs) => d.format("DD/MM/YYYY") === current?.format("DD/MM/YYYY")).map((d: Dayjs) => d.format("HH")).join(', ')}
          >
            {current.date()}
          </div>
        );
      else
        return info.originNode;
    }
    if (info.type === 'time') {
      if (selectedHours && selectedHours.includes(parseInt(current.toString()))) {
        return (
          <div className="ant-picker-time-panel-cell-inner"
            style={{ border: `1px solid ${token.colorPrimary}`, borderRadius: '5', }}
          >
            {current?.toString()}
          </div>
        );
      }
      return info.originNode;
    }
  };

  // useEffect(()=> {
  //   console.log('value::', value);
  //   console.log('currentViewDate::', currentViewDate);
    
  // },[value, currentViewDate])

  const createDisabledDate = (startYear: number) => {
    const startDate = dayjs(`${startYear}-01-01`); // Ngày bắt đầu
    const endDate = dayjs().startOf('year'); // Ngày 1-1 của năm hiện tại + 1
  
    return (current: Dayjs) => {
      return current && (current.isBefore(startDate, 'day') || current.isAfter(endDate, 'day'));
    };
  };
  return (
    <ConfigProvider locale={viVN}>
      {debugstr}
      {label && <Typography.Text style={{ fontSize: '16px' }}>{label} {required === true ? <span className="required-star" style={{ color: 'red' }}> *</span> : ''}</Typography.Text>}
      {mode === "range" ? (
        <RangePicker
          cellRender={cellRender}
          placeholder={[placeholderRange[0], placeholderRange[1]]}
          value={value ? [getVN2Utc0((value as [Dayjs, Dayjs])[0]), getVN2Utc0((value as [Dayjs, Dayjs])[1])] : [null, null]}
          onChange={onRangeChange}
          onCalendarChange={onCalendarChange}
          onBlur={onRangeChange}
          disabled={disabled}
          style={style}
          format={format}
          showTime={onlyDate ? false : true}
          allowClear={{
            clearIcon: <CloseOutlined />
          }}
          picker={picker}
          className={className}
          disabledDate={
            limitRange && Number(limitRange) 
              ? createDisabledDate(Number(limitRange)) 
              : undefined // Sử dụng undefined thay vì null
          }
        />
      ) : (
        <DatePicker
          size="middle"
          className={className}
          cellRender={cellRender}
          onOpenChange={handleOpenChange} // kg change ngay lan 2 dc 
          onPanelChange={handlePanelChange}
          // onBlur={()=>{
          //   // ban do => bao loi kg chon ngay
          //   const date = currentViewDate;
          //   onChange?.(date, [date, date]);
          // }}
          placeholder={placeholder ?? placeholderRange[0]}
          value={currentViewDate ?? (value ? getVN2Utc0(value as Dayjs) : null)}
          onChange={onSingleChange}
          onCalendarChange={onSingleChange}
          //onChange={onChange as DatePickerProps["onChange"]}
          disabled={disabled}
          defaultValue={value ? getVN2Utc0(value as Dayjs) : defaultValue}
          style={style}
          format={format}
          showTime={showTime ?? (onlyDate ? false : {
            format: 'HH', // Chỉ hiển thị giờ
            hourStep: 1, // Bước nhảy của giờ (có thể thay đổi nếu cần)
          })}
          allowClear={{
            clearIcon: <CloseOutlined />
          }}
          picker={picker}
          disabledDate={
            limitRange && Number(limitRange) 
              ? createDisabledDate(Number(limitRange)) 
              : undefined // Sử dụng undefined thay vì null
          }
        //{...rest} // loi die page
        />
      )}
    </ConfigProvider>
  );
};

export default DatePickerCustom;
