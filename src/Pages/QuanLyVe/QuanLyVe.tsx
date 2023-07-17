import React, { useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Table, Tag, DatePicker, Checkbox, Button, Modal } from "antd";
import { db } from "../../Firebase-config/firebase-config";
import { RenderedCell } from "rc-table/lib/interface";
import styles from "./QuanLyVe.module.css";

import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";

const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const QuanLyVe = () => {
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

    

    return (
        <>
            {/* Button "Lọc" */}
            <div className={styles.filterButton}>
                <Button type="primary" onClick={handleFilterButtonClick}>
                    Lọc
                </Button>
                
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
                        <div className="checkboxGroupContainer"> {/* Thêm lớp CSS */}
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
                    { title: "Booking code", dataIndex: "Code", key: "Code" },
                    { title: "Số vé", dataIndex: "SoVe", key: "SoVe" },
                    { title: "Tên sự kiện", dataIndex: "TenSK", key: "TenSK" },
                    {
                        title: "Tình trạng sử dụng",
                        dataIndex: "TinhTrangSuDung",
                        key: "TinhTrangSuDung",
                        render: renderTinhTrangSuDung as (
                            value: any,
                            record: any,
                            index: number
                        ) => ReactNode | RenderedCell<any>,
                    },
                    { title: "Ngày sử dụng", dataIndex: "NgaySuDung", key: "NgaySuDung" },
                    { title: "Ngày xuất vé", dataIndex: "NgayXuatVe", key: "NgayXuatVe" },
                    { title: "Cổng check - in", dataIndex: "CongCheckIn", key: "CongCheckIn" },
                ]}
                rowKey="MaTB"
                pagination={{
                    className: styles.customPagination,
                    style: {
                        position: "fixed",
                        left: "50%",
                        bottom: "20px",
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

export default QuanLyVe;
