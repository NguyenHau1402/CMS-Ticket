import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { Router, Route, Link, BrowserRouter, Routes } from "react-router-dom";
import { db } from "../../Firebase-config/firebase-config";
import { title } from "process";
import { render } from "react-dom";

const DatVe = () => {
    const [userList, setUserList] = useState<any[]>([]);

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
            setUserList(results);
        });
    }, []);

    const renderTinhTrangSuDung = (_: any, record: any) => {
        if (!record.TinhTrangSuDung || record.TinhTrangSuDung.length === 0) {
            console.log("abc");
            return null;
        }
        let color = record.TinhTrangSuDung.length < 12 ? 'gray' : 'green';
        let tagContent = record.TinhTrangSuDung.toUpperCase();
        if (record.TinhTrangSuDung.length === 7) {
            color = 'red';
        }
        return (
            <Tag color={color} key={record.TinhTrangSuDung}>
                {tagContent}
            </Tag>
        );
    };

    return (
        <>
            <Table
                dataSource={userList}
                columns={[
                    {
                        title: "STT", dataIndex: "STT", key: "STT",
                        sorter: (a, b) => {
                            const aIndex = parseInt(a.STT);
                            const bIndex = parseInt(b.STT);
                            return aIndex - bIndex;
                        },
                    },
                    { title: "Booking code", dataIndex: "Code", key: "Code" },
                    { title: "Số vé", dataIndex: "SoVe", key: "SoVe" },
                    { title: "Tên sự kiện", dataIndex: "TenSK", key: "TenSK" },
                    { title: "Tình trạng sử dụng", dataIndex: "TinhTrangSuDung", key: "TinhTrangSuDung", render: renderTinhTrangSuDung, },

                    { title: "Ngày sử dụng", dataIndex: "NgaySuDung", key: "NgaySuDung" },
                    { title: "Ngày xuất vé", dataIndex: "NgayXuatVe", key: "NgayXuatVe" },
                    { title: "Cổng check - in", dataIndex: "CongCheckIn", key: "CongCheckIn" },
                ]}
                rowKey="MaTB"
            />

        </>

    );
};

export default DatVe;
