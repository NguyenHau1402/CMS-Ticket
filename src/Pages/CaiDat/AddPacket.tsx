import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, Checkbox, Select } from "antd";
import styles from "./AddPacket.module.css";

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

  const handleAddPackage = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      // Gửi dữ liệu đi hoặc thực hiện các thao tác cần thiết
      onAddPackage(values);
      setConfirmLoading(false);
      form.resetFields();
      onCancel();
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const handleCheckboxChange = (option: number) => {
    setSelectedOption(option);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <div className={styles.nameTicket}>
          <Form.Item label="Mã sự kiện" name="Mã sự kiện" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên sự kiện" name="tenSuKien" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </div>
        <div className={styles.dateTicket}>
          <Form.Item label="Ngày áp dụng" name="ngayApDung" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Ngày hết hạn" name="ngayHetHan" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
        </div>
        <div className={styles.priceTicket}>
          <Form.Item label="Giá vé áp dụng" name="giaVe" rules={[{ required: true }]}>
            <Checkbox.Group
              onChange={(values: any) => {
                if (values.length === 0) {
                  setSelectedOption(0);
                } else if (values.includes(1)) {
                  setSelectedOption(1);
                } else if (values.includes(2)) {
                  setSelectedOption(2);
                }
              }}
            >
              <div className={styles.groupTicket}>
                <Checkbox value={1}>Vé lẻ (vnđ/vé) với giá / 1 vé</Checkbox>
                <Input disabled={selectedOption !== 1} />
              </div>
              <div className={styles.groupTicket}>
                <Checkbox value={2}>Combo vé với giá / 1 vé</Checkbox> 
                <Input disabled={selectedOption !== 2} />
                
              </div>
            </Checkbox.Group>
          </Form.Item>
        </div>
        <div className={styles.statusTicket}>
          <Form.Item label="Tình trạng" name="tinhTrang" rules={[{ required: true }]}>
            <Select>
              <Option value="1">Đang áp dụng</Option>
              <Option value="2">Tắt</Option>
            </Select>
          </Form.Item>
        </div>
        <Form.Item>
          <Button type="primary" onClick={handleAddPackage} loading={confirmLoading}>
            Thêm gói vé
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddPackageModal;
