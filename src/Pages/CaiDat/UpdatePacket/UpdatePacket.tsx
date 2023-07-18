import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Modal, Form, Input, DatePicker, Button, Checkbox, Select } from 'antd';
import { db } from '../../../Firebase-config/firebase-config';
import styles from "./UpdatePacket.module.css";

const { Option } = Select;


interface UpdateDeviceModalProps {
  visible: boolean;
  onCancel: () => void;
}

const UpdatePacket: React.FC<UpdateDeviceModalProps> = ({ visible, onCancel }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        if (!id) {
          console.log('ID không hợp lệ');
          console.log(id);
          return;
        }
        const deviceRef = doc(db, 'QuanLyVe', id);
        const deviceSnapshot = await getDoc(deviceRef);
        if (deviceSnapshot.exists()) {
          const deviceData = deviceSnapshot.data();
          form.setFieldsValue({
            TenGoiVe: deviceData.TenSK,
            NgaySuDung: deviceData.NgaySuDung?.toDate() || null,
            NgayXuatVe: deviceData.NgayXuatVe?.toDate() || null,
            GiaVe: deviceData.GiaVe,
            GiaCb: deviceData.GiaCb,
            TinhTrang: deviceData.TinhTrang,
          });
        } else {
          console.log('Thiết bị không tồn tại.');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thiết bị:', error);
      }
    };

    fetchDeviceData();
  }, [id]);

  const handleCancel = () => {
    onCancel();
  };

  const handleUpdateDevice = async () => {
    try {
      if (!id) {
        console.log('ID không hợp lệ');
        console.log(id);
        return;
      }

      const values = await form.validateFields();

      const updatedDevice = {
        TenSK: values.TenGoiVe,
        NgaySuDung: values.NgaySuDung,
        NgayXuatVe: values.NgayXuatVe,
        GiaVe: values.GiaVe,
        GiaCb: values.GiaCb,
        TinhTrang: values.TinhTrang,
      };

      const deviceRef = doc(db, 'QuanLyVe', id);
      await updateDoc(deviceRef, updatedDevice);

      console.log('Cập nhật thành công:', updatedDevice);
      onCancel();
    } catch (error) {
      console.error('Lỗi khi cập nhật thiết bị:', error);
    }
  };

  return (
    <Modal visible={visible} onCancel={handleCancel} footer={null} centered destroyOnClose>
      <Form form={form} layout="vertical">
        <Form.Item label="Tên gói vé" name="TenGoiVe" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Ngày áp dụng" name="NgaySuDung">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Ngày hết hạn" name="NgayXuatVe">
          <DatePicker format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Giá vé áp dụng" name="GiaVe" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Giá combo áp dụng" name="GiaCb" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Tình trạng" name="TinhTrang" rules={[{ required: true }]}>
          <Select>
            <Option value="Đang áp dụng">Đang áp dụng</Option>
            <Option value="Tắt">Tắt</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleUpdateDevice}>
            Cập nhật gói vé
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    
  );
};

export default UpdatePacket;
