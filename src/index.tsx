
import ReactDOM from 'react-dom/client';
import MenuBar from './Components/MenuBar/MenuBar';
import { Calendar, DatePicker } from 'antd';
import QuanLyVe from './Pages/QuanLyVe/QuanLyVe';
import DoiSoatVe from './Pages/DoiSoatVe/DoiSoatVe';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <DoiSoatVe></DoiSoatVe>
  </div>
)
