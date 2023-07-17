import React, { useState, useEffect, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Table, Tag, DatePicker, Checkbox, Button, Modal } from "antd";
import { db } from "../../Firebase-config/firebase-config";
import styles from "./QuanLyVe.module.css";
import { CSVLink } from "react-csv";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import search from './icon/search.svg'


const { RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;

const DoiSoatVe = () => {
    const [userList, setUserList] = useState<any[]>([]);
    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [filterInput, setFilterInput] = useState("");
    const [dateRange, setDateRange] = useState<any[]>([]);
    const [tinhTrangDoiSoat, setTinhTrangDoiSoat] = useState<CheckboxValueType[]>([]);
    const [disableTinhTrangDoiSoat, setDisableTinhTrangDoiSoat] = useState(false);
    const [isAllTinhTrangDoiSoatChecked, setIsAllTinhTrangDoiSoatChecked] = useState(false);

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

    const handleTinhTrangDoiSoatChange = (values: any[]) => {
        setTinhTrangDoiSoat(values);
    };

    const handleAllTinhTrangDoiSoatChange = (e: CheckboxChangeEvent) => {
        const isChecked = e.target.checked;
        setIsAllTinhTrangDoiSoatChecked(isChecked);
        setDisableTinhTrangDoiSoat(isChecked);
        setTinhTrangDoiSoat(isChecked ? ["Tất cả"] : []);
    };

    const tinhTrangDoiSoatOptions = [
        { label: "Tất cả", value: "Tất cả" },
        { label: "Đã đổi soát", value: "Đã đổi soát" },
        { label: "Chưa đổi soát", value: "Chưa đổi soát" },
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


        // Lọc theo cổng check-in
        if (tinhTrangDoiSoat && tinhTrangDoiSoat.length > 0) {
            results = results.filter((user) =>
                tinhTrangDoiSoat.includes(user.TinhTrangDoiSoat)
            );
        }

        setSearchResult(results);

    };

    const handleExportToExcel = () => {
        console.log("Export button clicked");
        // Chuẩn bị dữ liệu cho file CSV
        const csvData = searchResult.map((user) => ({
            // Định dạng dữ liệu cho từng cột
            STT: user.STT,
            "Số vé": user.SoVe,

            "Ngày sử dụng": user.NgaySuDung,
            "Tên loại vé": user.LoaiVe,
            "Cổng check - in": user.CongCheckIn,
            "Tình trạng đổi soát": user.TinhTrangDoiSoat,
        }));

        // Định nghĩa các cột cho file CSV
        const csvHeaders = [
            { label: "STT", key: "STT" },

            { label: "Số vé", key: "Số vé" },
            { label: "Ngày sử dụng", key: "Ngày sử dụng" },
            { label: "Tên loại vé", key: "Tên loại vé" },
            { label: "Cổng check - in", key: "Cổng check - in" },
            { label: "Tình trạng đổi soát", key: "Tình trạng đổi soát" },
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
                    <img src={search} alt="search" className='image' />


                </div>
                <div className={styles.buttonFilter}>
                    {handleExportToExcel()}
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.tablecontainer}>
                    <Table
                        dataSource={searchResult.length > 0 ? searchResult : userList}
                        columns={[
                            { title: "STT", dataIndex: "STT", key: "STT" },
                            { title: "Số vé", dataIndex: "SoVe", key: "SoVe" },
                            { title: "Ngày sử dụng", dataIndex: "NgaySuDung", key: "NgaySuDung" },
                            { title: "Tên loại vé", dataIndex: "LoaiVe", key: "LoaiVe" },
                            { title: "Cổng check - in", dataIndex: "CongCheckIn", key: "CongCheckIn" },
                            {
                                title: "",
                                dataIndex: "TinhTrangDoiSoat",
                                key: "TinhTrangDoiSoat",

                                render: (renderTinhTrangDoiSoat) => {
                                    let color = "gray";

                                    if (renderTinhTrangDoiSoat === "Đã đổi soát") {
                                        color = "red";
                                    }

                                    return (
                                        <span style={{ color, fontStyle: 'italic' }}>
                                            {renderTinhTrangDoiSoat}
                                        </span>
                                    );
                                },
                            },
                        ]}
                        rowKey="MaTB"
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
                </div>

                <div className={styles.filterItem}>
                    <span className={styles.filterLabel}>Trạng thái Soát vé:</span>
                    <Checkbox
                        onChange={handleAllTinhTrangDoiSoatChange}
                        checked={isAllTinhTrangDoiSoatChecked}
                    >
                        Tất cả
                    </Checkbox>
                    <CheckboxGroup
                        options={tinhTrangDoiSoatOptions.slice(1)}
                        value={tinhTrangDoiSoat}
                        onChange={handleTinhTrangDoiSoatChange}
                        disabled={disableTinhTrangDoiSoat}
                    />
                    <span className={styles.filterLabel}>Loại vé: Vé cổng</span>
                    <span className={styles.filterLabel}> Ngày bắt đầu: </span>
                    <RangePicker onChange={handleDateChange} />
                    <div className={styles.filterItem}>
                        <Button className={styles.btnfm} onClick={handleFilterData}>
                            Lọc
                        </Button>
                    </div>







                </div>





            </div>



        </>
    );
};

export default DoiSoatVe;
