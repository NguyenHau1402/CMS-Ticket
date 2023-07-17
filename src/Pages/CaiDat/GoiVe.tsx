import React, { useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Table, Tag, DatePicker, Checkbox, Button, Modal } from "antd";
import { db } from "../../Firebase-config/firebase-config";
import { RenderedCell } from "rc-table/lib/interface";
import styles from "./QuanLyVe.module.css";
import { CSVLink } from "react-csv";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import search from './icon/search.svg'


const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const GoiVe = () => {
    const [userList, setUserList] = useState<any[]>([]);
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [filterInput, setFilterInput] = useState("");
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [tinhTrangSuDung, setTinhTrangSuDung] = useState<string[]>([]);
    const [disableTinhTrangSuDung, setDisableTinhTrangSuDung] = useState(false);
    const [isAllTinhTrangSuDungChecked, setIsAllTinhTrangSuDungChecked] = useState(false);
    const [congCheckIn, setCongCheckIn] = useState<CheckboxValueType[]>([]);
    const [disableCongCheckIn, setDisableCongCheckIn] = useState(false);
    const [isAllCongChecked, setIsAllCongChecked] = useState(false);
    const [showFilter, setShowFilter] = useState(false); // Trạng thái hiển thị giao diện phần lọc

    useEffect(() => {
        const colRef = collection(db, "QuanLyVe");
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const results: any[] = [];
            snapshot.forEach((doc) => {
                results.push({
                    id: doc.id,
                    ...doc.data(),
                });
            });
            // Sắp xếp dữ liệu theo cột STT
            results.sort((a, b) => {
                const aIndex = parseInt(a.STT);
                const bIndex = parseInt(b.STT);
                return aIndex - bIndex;
            });
            setUserList(results);
        });

        // Clean up the subscription
        return () => unsubscribe();
    }, []);

    // Hàm xử lý sự kiện nhấn nút "Lọc"
    const handleFilterButtonClick = () => {
        setShowFilter(true);
    };

    const handleCloseModal = () => {
        setShowFilter(false);
    };

    const handleFilterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilterInput(e.target.value);
    };

    const handleSearch = () => {
        const results = userList.filter((user) =>
            user.Code.includes(filterInput)
        );
        setSearchResult(results);
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleDateChange = (dates: any) => {
        setDateRange(dates);
    };

    const handleTinhTrangSuDungChange = (values: any[]) => {
        setTinhTrangSuDung(values);
    };

    const handleAllTinhTrangSuDungChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        setIsAllTinhTrangSuDungChecked(isChecked);
        setDisableTinhTrangSuDung(isChecked);
        setTinhTrangSuDung(isChecked ? ["Tất cả"] : []);
    };

    const tinhTrangSuDungOptions = [
        { label: "Tất cả", value: "Tất cả" },
        { label: "Đã sử dụng", value: "Đã sử dụng" },
        { label: "Chưa sử dụng", value: "Chưa sử dụng" },
        { label: "Hết hạn", value: "Hết hạn" },
    ];

    const handleCongCheckInChange = (values: any[]) => {
        setCongCheckIn(values);
    };

    const handleAllCongChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        setIsAllCongChecked(isChecked);
        setDisableCongCheckIn(isChecked);
        setCongCheckIn(isChecked ? ["Tất cả"] : []);
        setDisableCongCheckIn(isChecked);
    };

    const congCheckInOptions = [
        { label: "Tất cả", value: "Tất cả" },
        { label: "Cổng 1", value: "Cổng 1" },
        { label: "Cổng 2", value: "Cổng 2" },
        { label: "Cổng 3", value: "Cổng 3" },
    ];

    const handleFilterData = () => {
        let results = [...userList];

        // Lọc theo khoảng ngày
        if (dateRange && dateRange.length === 2) {
            results = results.filter((user) => {
                const ngaySuDung = user.NgaySuDung;
                return (
                    ngaySuDung >= dateRange[0].startOf("day") &&
                    ngaySuDung <= dateRange[1].endOf("day")
                );
            });
        }

        // Lọc theo tình trạng sử dụng
        if (tinhTrangSuDung && tinhTrangSuDung.length > 0) {
            results = results.filter((user) =>
                tinhTrangSuDung.includes(user.TinhTrangSuDung)
            );
        }

        // Lọc theo cổng check-in
        if (congCheckIn && congCheckIn.length > 0) {
            results = results.filter((user) =>
                congCheckIn.includes(user.CongCheckIn)
            );
        }

        setSearchResult(results);
        setShowFilter(false); // Đóng modal sau khi hoàn thành việc lọc
    };

    const renderTinhTrangSuDung = (_: any, record: any): ReactNode => {
        if (!record.TinhTrangSuDung || record.TinhTrangSuDung.length === 0) {
            console.log("abc");
            return null;
        }
        let color = record.TinhTrangSuDung.length < 12 ? "gray" : "green";
        let tagContent = record.TinhTrangSuDung.toUpperCase();
        if (record.TinhTrangSuDung.length === 7) {
            color = "red";
        }
        return (
            <Tag color={color} key={record.TinhTrangSuDung}>
                {tagContent}
            </Tag>
        );
    };
    const handleExportToExcel = () => {
        console.log("Export button clicked");
        // Chuẩn bị dữ liệu cho file CSV
        const csvData = searchResult.map((user) => ({
            // Định dạng dữ liệu cho từng cột
            STT: user.STT,
            "Booking code": user.Code,
            "Số vé": user.SoVe,
            "Tên sự kiện": user.TenSK,
            "Tình trạng sử dụng": user.TinhTrangSuDung,
            "Ngày sử dụng": user.NgaySuDung,
            "Ngày xuất vé": user.NgayXuatVe,
            "Cổng check - in": user.CongCheckIn,
        }));

        // Định nghĩa các cột cho file CSV
        const csvHeaders = [
            { label: "STT", key: "STT" },
            { label: "Booking code", key: "Booking code" },
            { label: "Số vé", key: "Số vé" },
            { label: "Tên sự kiện", key: "Tên sự kiện" },
            { label: "Tình trạng sử dụng", key: "Tình trạng sử dụng" },
            { label: "Ngày sử dụng", key: "Ngày sử dụng" },
            { label: "Ngày xuất vé", key: "Ngày xuất vé" },
            { label: "Cổng check - in", key: "Cổng check - in" },
        ];

        // JSX của nút xuất file CSV
        const csvLink = (
            <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="data.csv"
                className={styles.btn} // Thêm lớp CSS của Ant Design cho nút
            >
                Xuất file (.csv)
            </CSVLink>
        );

        return csvLink;
    };


    return (
        <>
            {/* Button "Lọc" và nút "Xuất Excel" */}
            <div className={styles.searchWrapper}>
                <div className={styles.search}>
                    <input
                        type="text"
                        value={filterInput}
                        onChange={handleFilterInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm bằng số vé..."
                    />
                    <img src={search} alt="logo" className='image' />


                </div>
                <div className={styles.buttonFilter}>
                    <button className={styles.btn} onClick={handleFilterButtonClick}>
                        Lọc vé
                    </button>
                    {handleExportToExcel()}
                </div>
            </div>


            <Modal
                open={showFilter}
                onCancel={handleCloseModal}
                footer={null}
                centered
                destroyOnClose
            >
                <div className={`${styles.filter} ${styles.filterContainer}`}>
                    <div className={styles.filterItem}>
                        <label>Ngày:</label>
                        <RangePicker onChange={handleDateChange} />
                    </div>
                    <div className={styles.filterItem}>
                        <label>Tình trạng sử dụng:</label>

                        <Checkbox
                            onChange={handleAllTinhTrangSuDungChange}
                            checked={isAllTinhTrangSuDungChecked}
                        >
                            Tất cả
                        </Checkbox>
                        <CheckboxGroup
                            options={tinhTrangSuDungOptions.slice(1)}
                            value={tinhTrangSuDung}
                            onChange={handleTinhTrangSuDungChange}
                            disabled={disableTinhTrangSuDung}
                        />

                    </div>
                    <div className={styles.filterItem}>
                        <label>Cổng Check - in:</label>
                        <Checkbox
                            onChange={handleAllCongChange}
                            checked={isAllCongChecked}
                        >
                            Tất cả
                        </Checkbox>
                        <CheckboxGroup
                            options={congCheckInOptions.slice(1)}
                            value={congCheckIn}
                            onChange={handleCongCheckInChange}
                            disabled={disableCongCheckIn}
                        />
                    </div>

                    <Button type="primary" onClick={handleFilterData}>
                        Lọc
                    </Button>
                </div>
            </Modal>


            <Table
                dataSource={searchResult.length > 0 ? searchResult : userList}
                columns={[
                    { title: "STT", dataIndex: "STT", key: "STT" },
                    { title: "Mã gói", dataIndex: "Code", key: "Code" },
                    { title: "Tên gói vé", dataIndex: "TenGoiVe", key: "TenGoiVe" },
                    { title: "Ngày áp dụng", dataIndex:"NgayXuatVe", key: "NgayXuatVe"},
                    { title: "Ngày hết hạn", dataIndex:"NgaySuDung", key:"NgaySuDung"},
                    { title: "Giá vé(VNĐ/Vé)", dataIndex:"GiaVe", key:"GiaVe"},
                    { title: "Giá Combo(VNĐ/Combo)", dataIndex:"GiaCb", key:"GiaCb"},
                    { title: "Tình trạng", dataIndex:"TinhTrang", key:"TinhTrang"},
                    
                ]}
                rowKey="STT"
                pagination={{
                    className: styles.customPagination,
                    style: {
                        position: "fixed",
                        left: "50%",
                        bottom: "5px",
                        transform: "translateX(-50%)",
                    },
                    itemRender: (page, type, originalElement) => {
                        if (type === "page") {
                            return <span style={{ color: "orange" }}>{page}</span>;
                        }
                        return originalElement;
                    },
                }}
            />
        </>
    );
};

export default GoiVe;
