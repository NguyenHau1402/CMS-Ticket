import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { Table, Modal, DatePicker } from "antd";
import { db } from "../../Firebase-config/firebase-config";
import styles from "./QuanLyVe.module.css";
import { CSVLink } from "react-csv";
import search from './icon/search.svg';
import AddPackageModal from "./AddPacket";

const { RangePicker } = DatePicker;

const GoiVe = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [searchResult, setSearchResult] = useState<any[]>([]);
  const [filterInput, setFilterInput] = useState("");
  const [showFilter, setShowFilter] = useState(false); // Trạng thái hiển thị giao diện phần lọc
  const [showAddModal, setShowAddModal] = useState(false); // Trạng thái hiển thị giao diện modal thêm gói vé

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

  const handleFilterData = () => {
    let results = [...userList];
    setSearchResult(results);
    setShowFilter(false); // Đóng modal sau khi hoàn thành việc lọc
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

  const handleAddPackage = (values: any) => {
    // Xử lý thêm gói vé với dữ liệu `values`
    console.log("Thêm gói vé:", values);
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
          <button className={styles.btn} onClick={() => setShowAddModal(true)}>
            Thêm gói vé
          </button>
          {handleExportToExcel()}
        </div>
      </div>

      <Modal
        visible={showFilter}
        onCancel={handleCloseModal}
        footer={null}
        centered
        destroyOnClose
      >
        {/* Nội dung modal */}
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
          { title: "Ngày áp dụng", dataIndex: "NgayXuatVe", key: "NgayXuatVe" },
          { title: "Ngày hết hạn", dataIndex: "NgaySuDung", key: "NgaySuDung" },
          { title: "Giá vé(VNĐ/Vé)", dataIndex: "GiaVe", key: "GiaVe" },
          { title: "Giá Combo(VNĐ/Combo)", dataIndex: "GiaCb", key: "GiaCb" },
          { title: "Tình trạng", dataIndex: "TinhTrang", key: "TinhTrang" },
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
