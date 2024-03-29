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
    const [showFilter, setShowFilter] = useState(false); 


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
            results.sort((a, b) => {
                const aIndex = parseInt(a.STT);
                const bIndex = parseInt(b.STT);
                return aIndex - bIndex;
            });
            setUserList(results);
        });

        return () => unsubscribe();
    }, []);

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

        if (dateRange && dateRange.length === 2) {
            results = results.filter((user) => {
                const ngaySuDung = user.NgaySuDung;
                return (
                    ngaySuDung >= dateRange[0].startOf("day") &&
                    ngaySuDung <= dateRange[1].endOf("day")
                );
            });
        }

        if (tinhTrangSuDung && tinhTrangSuDung.length > 0) {
            results = results.filter((user) =>
                tinhTrangSuDung.includes(user.TinhTrangSuDung)
            );
        }

        if (congCheckIn && congCheckIn.length > 0) {
            results = results.filter((user) =>
                congCheckIn.includes(user.CongCheckIn)
            );
        }

        setSearchResult(results);
        setShowFilter(false); 
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
    const formatTimestamp = (timestamp: { seconds: number; }) => {
        const date = new Date(timestamp.seconds * 1000);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        return formattedDate;
    };


    const renderNgaySuDung = (_: any, record: any): React.ReactNode => {
        if (!record.NgaySuDung) {
            return null;
        }
        return <span>{formatTimestamp(record.NgaySuDung)}</span>;
    };

    const renderNgayXuatVe = (_: any, record: any): React.ReactNode => {
        if (!record.NgayXuatVe) {
            return null;
        }
        return <span>{formatTimestamp(record.NgayXuatVe)}</span>;
    };

    const handleExportToExcel = () => {
        console.log("Export button clicked");
        const csvData = searchResult.map((user) => ({
            STT: user.STT,
            "Booking code": user.Code,
            "Số vé": user.SoVe,
            "Tên sự kiện": user.TenSK,
            "Tình trạng sử dụng": user.TinhTrangSuDung,
            "Ngày sử dụng": user.NgaySuDung,
            "Ngày xuất vé": user.NgayXuatVe,
            "Cổng check - in": user.CongCheckIn,
        }));

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

        const csvLink = (
            <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="data.csv"
                className={styles.btn} 
            >
                Xuất file (.csv)
            </CSVLink>
        );

        return csvLink;
    };



    return (
        <>
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
                        ) => React.ReactNode | RenderedCell<any>,
                    },
                    { title: "Ngày sử dụng", dataIndex: "NgayXuatVe", key: "NgayXuatVe", render: renderNgayXuatVe },
                    { title: "Ngày xuất vé", dataIndex: "NgaySuDung", key: "NgaySuDung", render: renderNgaySuDung },
                    { title: "Cổng check - in", dataIndex: "CongCheckIn", key: "CongCheckIn" },
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
        </>
    );
};

export default QuanLyVe;
