import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import { db } from "../../Firebase-config/firebase-config";


const GoiVe = () => {
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
                    { title: "Mã gói", dataIndex: "Code", key: "Code" },
                    { title: "Tên gói vé", dataIndex: "TenGoiVe", key: "TenGoiVe" },
                    { title: "Ngày áp dụng", dataIndex: "NgaySuDung", key: "NgaySuDung" },
                    { title: "Ngày hết hạn", dataIndex: "NgayXuatVe", key: "NgayXuatVe" },
                    { title: "Giá vé (VNĐ/Vé)", dataIndex: "GiaVe", key: "GiaVe" },
                    { title: "Giá Combo (VNĐ/Combo)", dataIndex: "GiaCb", key: "GiaCb" },
                    { title: "Tình trạng", dataIndex: "TinhTrangSuDung", key: "TinhTrangSuDung", render: renderTinhTrangSuDung, },
                    Table.EXPAND_COLUMN,
                    {
                        title: "",
                        key: "action",
                        render: (_, record) => (
                            <Space size="middle">
                                <span>Cập nhập</span>
                            </Space>
                        ),
                    },

                ]}
                rowKey="MaTB"
            />

        </>

    );
};

export default GoiVe;
