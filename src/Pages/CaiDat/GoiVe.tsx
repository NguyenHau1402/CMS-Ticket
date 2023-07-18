import React, { useState, useEffect, ReactNode } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { Table, Modal, DatePicker, Space, Tag } from "antd";
import { db } from "../../Firebase-config/firebase-config";
import styles from "./GoiVe.module.css";
import { CSVLink } from "react-csv";
import search from './icon/search.svg';
import AddPackageModal from "./AddPacket/AddPacket";
import { Link, Route, Routes, useParams } from "react-router-dom";
import UpdatePacket from "./UpdatePacket/UpdatePacket";

const GoiVe = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [filterInput, setFilterInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [exportLink, setExportLink] = useState<ReactNode | null>(null);


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

  const handleExportToExcel = () => {
    try {
      console.log(userList);
      const csvData = searchResult.map((user) => ({
        STT: user.STT,
        "Mã gói": user.Code,
        "Tên gói vé": user.TenGoiVe,
        "Ngày áp dụng": user.NgaySuDung,
        "Ngày hết hạn": user.NgayXuatVe,
        "Giá vé": user.GiaVe,
        "Giá Combo": user.GiaCb,
        "Tình trạng": user.TinhTrang,
      }));

      const csvHeaders = [
        { label: "STT", key: "STT" },
        { label: "Mã gói", key: "Mã gói" },
        { label: "Tên gói vé", key: "Tên gói vé" },
        { label: "Ngày áp dụng", key: "Ngày áp dụng" },
        { label: "Ngày hết hạn", key: "Ngày hết hạn" },
        { label: "Giá vé", key: "Giá vé" },
        { label: "Giá Combo", key: "Giá Combo" },
        { label: "Tình trạng", key: "Tình trạng" },
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
    } catch (error) {
      console.error("Lỗi khi xuất file CSV:", error);
      return null;
    }
  };
  const renderTinhTrang = (_: any, record: any): ReactNode => {
    if (!record.TinhTrang || record.TinhTrang.length === 0) {
        console.log("abc");
        return null;
    }
    let color = record.TinhTrang.length < 4  ? "red" : "green";
    let tagContent = record.TinhTrang.toUpperCase();
    return (
        <Tag color={color} key={record.TinhTrang}>
            {tagContent}
        </Tag>
    );
};

  const handleAddPackage = (values: any) => {
    console.log("Thêm gói vé:", values);
  };

  const formatTimestamp = (timestamp: { seconds: number }) => {
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
          <button className={styles.btn} onClick={() => setShowAddModal(true)}>
            Thêm gói vé
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
      </Modal>

      <AddPackageModal
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        onAddPackage={handleAddPackage}
      />

      <Table
        dataSource={searchResult.length > 0 ? searchResult : userList}
        columns={[
          { title: "STT", dataIndex: "STT", key: "STT" },
          { title: "Mã gói", dataIndex: "Code", key: "Code" },
          { title: "Tên gói vé", dataIndex: "TenGoiVe", key: "TenGoiVe" },
          { title: "Ngày áp dụng", dataIndex: "NgaySuDung", key: "NgaySuDung", render: renderNgaySuDung },
          { title: "Ngày hết hạn", dataIndex: "NgayXuatVe", key: "NgayXuatVe", render: renderNgayXuatVe },
          { title: "Giá vé(VNĐ/Vé)", dataIndex: "GiaVe", key: "GiaVe" },
          { title: "Giá Combo(VNĐ/Combo)", dataIndex: "GiaCb", key: "GiaCb" },
          { title: "Tình trạng", dataIndex: "TinhTrang", key: "TinhTrang", render: renderTinhTrang },
          {
            title: "",
            key: "action",
            render: (_, record) => (
              <Space size="middle">
                <Link to={`/setting/UpdatePacket/${record.id}`}>Cập nhập</Link>
              </Space>
            ),
          },
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

      <Routes>
        <Route
          path="/setting/UpdatePacket/:id"
          element={<UpdatePacket visible={true} onCancel={() => { }} />}
        />
      </Routes>
    </>
  );
};

export default GoiVe;
