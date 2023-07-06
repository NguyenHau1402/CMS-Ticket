
import ReactDOM from 'react-dom/client';
import MenuBar from './Components/MenuBar/MenuBar';
import DatVe from './Pages/DatVe/DatVe';
import { Calendar, DatePicker } from 'antd';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <div>
    <DatePicker></DatePicker>
  </div>
)
