import { FunctionComponent } from "react";
import { ConfigProvider, DatePicker, Form, Typography } from "antd";
import { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/vi';
import viVN from "antd/lib/locale/vi_VN";
import ShowToast from "../show-toast/ShowToast";

dayjs.locale('vi');

type DatePickerComponentProps = {
    label?: string;
    placeholder?: string;
    placeholderRange?: string[];
    value?: string[] | [Dayjs, Dayjs] | null; // Chấp nhận chuỗi hoặc Dayjs
    onChange?: DatePickerProps["onChange"] | RangePickerProps["onChange"];
    disabled?: boolean;
    style?: any;
    format?: string;
    picker?: "week" | "month" | "quarter" | "year";
    mode?: "date" | "range";
    allowClear?: boolean;
    defaultValue?: Dayjs;
    limit?: number | null;
    onlyDate?: boolean;
};

const { RangePicker } = DatePicker;

const DatePickerCustomOld: FunctionComponent<DatePickerComponentProps> = ({
    label,
    placeholder,
    placeholderRange = ["Bắt đầu", "Kết thúc"],
    value,
    onChange,
    disabled,
    style,
    format = "DD/MM/YYYY",
    mode = "date",
    allowClear = true,
    limit,
    onlyDate = true,
    picker
}) => {

    // Chuyển đổi value từ string[] sang Dayjs[]
    let convertedValue: [Dayjs, Dayjs] | null = null;
    if (value && Array.isArray(value) && value.length === 2) {
        convertedValue = [dayjs(value[0]), dayjs(value[1])];
    }

    const onRangeChange = (dates: any) => {
        if (dates && dates[0] && dates[1]) {
            const [start, end] = dates;
            const diff = end.diff(start, 'day');

            if (limit && diff > limit) {
                ShowToast('error', `Có lỗi xảy ra`, `Khoảng thời gian tối đa có thể chọn là ${limit} ngày`, 6);
                onChange?.(start, [start, start]);
            } else {
                onChange?.(dates, [start.format(format), end.format(format)]);
            }
        } else {
            onChange?.(null as any, null as any);
            ShowToast('error', `Có lỗi xảy ra`, `Giá trị không hợp lệ`, 6);
        }
    };

    return (
        <ConfigProvider locale={viVN}>
            {label && <Typography.Text style={{ fontSize: '16px' }}>{label}</Typography.Text>}
            {mode === "range" ? (
                <RangePicker
                    placeholder={[placeholderRange[0], placeholderRange[1]]}
                    value={convertedValue}
                    onChange={onRangeChange}
                    disabled={disabled}
                    style={style}
                    format={format}
                    showTime={onlyDate ? false : { format: 'HH' }}
                    allowClear={allowClear}
                    picker={picker}
                />
            ) : (
                <DatePicker
                    placeholder={placeholder ?? placeholderRange[0]}
                    value={convertedValue ? convertedValue[0] : null}
                    onChange={onChange as DatePickerProps["onChange"]}
                    disabled={disabled}
                    style={style}
                    format={format}
                    showTime={onlyDate ? false : { format: 'HH' }}
                    allowClear={allowClear}
                    picker={picker}
                />
            )}
        </ConfigProvider>
    );
};

export default DatePickerCustomOld;
