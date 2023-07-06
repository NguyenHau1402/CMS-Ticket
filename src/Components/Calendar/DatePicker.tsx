import React from 'react';
import { DatePicker, Space } from 'antd';
import '../Calendar/DatePicker.css'
const { RangePicker } = DatePicker;

const App: React.FC = () => (
  <Space direction="vertical" size={12}>
    <DatePicker.RangePicker picker='date' showTime open/>
    
  </Space>
);

export default App;