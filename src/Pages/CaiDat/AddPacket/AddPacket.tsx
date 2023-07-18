import React, { useEffect, useState, ReactNode } from "react";
import { Modal, Form, Input, DatePicker, Button, Checkbox, Select } from "antd";
import styles from "./AddPacket.module.css";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../Firebase-config/firebase-config";

const { Option } = Select;

interface AddPackageModalProps {
  visible: boolean;
  onCancel: () => void;
  onAddPackage: (values: any) => void;
}

const AddPackageModal: React.FC<AddPackageModalProps> = ({
  visible,
  onCancel,
  onAddPackage,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [giaVeInput, setGiaVeInput] = useState("");

  const handleCheckboxChange = (values: any) => {
    const selected = values.find((value: number) => value === 1 || value === 2);
    setSelectedOption(selected);
  };

  const handleGiaVeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGiaVeInput(event.target.value);
  };

  const handleAddPackage = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      const NgaySuDung = values.NgaySuDung?.toDate();
      const NgayXuatVe = values.NgayXuatVe?.toDate();
      const data = {
        ...values,
        NgaySuDung: NgaySuDung ? Timestamp.fromDate(NgaySuDung) : null,
        NgayXuatVe: NgayXuatVe ? Timestamp.fromDate(NgayXuatVe) : null,
        GiaVe: selectedOption === 1 ? giaVeInput : "",
        GiaCb: selectedOption === 2 ? giaVeInput : "",
      };

      await addDoc(collection(db, "QuanLyVe"), data);

      onAddPackage(data);
      setConfirmLoading(false);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <div className={styles.nameAdd}>
          <Form.Item label="Tên gói vé" name="TenGoiVe" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>
        <div className={styles.dateAdd}>
          <Form.Item label="Ngày áp dụng" name="NgaySuDung" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Ngày hết hạn" name="NgayXuatVe" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
        </div>
        <div className={styles.priceAdd}>
          <Form.Item label="Giá vé áp dụng" name="GiaVe" rules={[{ required: true }]}>
            <Checkbox.Group onChange={handleCheckboxChange}>
              <div className={styles.priceAddCheckBox}>
                <Checkbox value={1}>Vé lẻ (vnđ/vé) với giá / 1 vé</Checkbox>
                <Input
                  disabled={selectedOption !== 1}
                  value={selectedOption === 1 ? giaVeInput : ""}
                  onChange={handleGiaVeInputChange}
                />
              </div>
              <div className={styles.priceAddCheckBox}>
                <Checkbox value={2}>Combo vé với giá / 1 vé</Checkbox>
                <Input
                  disabled={selectedOption !== 2}
                  value={selectedOption === 2 ? giaVeInput : ""}
                  onChange={handleGiaVeInputChange}
                />
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>
        <div className={styles.statusDropbar}>
          <Form.Item label="Tình trạng" name="TinhTrang" rules={[{ required: true }]}>
            <Select>
              <Option value="Đang áp dụng">Đang áp dụng</Option>
              <Option value="Tắt">Tắt</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item>
          <div className={styles.btnAdd}>
            <Button className={styles.btnstsAdd} onClick={handleAddPackage} loading={confirmLoading}>
              Lưu
            </Button>
            <Button className={styles.btnstsCnl} onClick={onCancel} loading={confirmLoading}>
              Hủy
            </Button>
          </div>
          
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPackageModal;
function setShowAddModal(arg0: boolean) {
  throw new Error("Function not implemented.");
}

