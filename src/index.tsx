
import ReactDOM from 'react-dom/client';
import MenuBar from './Components/MenuBar/MenuBar';
import { Calendar, DatePicker } from 'antd';
import QuanLyVe from './Pages/QuanLyVe/QuanLyVe';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <QuanLyVe></QuanLyVe>
  </div>
)
