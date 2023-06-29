import React, { useState } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import '../MenuBar/MenuBar.css'
import logo from './icon/logo.svg'
import DatVe from '../../Pages/DatVe/DatVe';
import DoiVe from '../../Pages/DoiVe/DoiVe';

const MenuBar = () => {
    const [showData, setShowData] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleMenuClick = () => {
        setShowData(true);
    };


    return (
        <BrowserRouter basename="/">
            <div className='container'>
                <div className='menu-bar'>
                    <div className='logomenu'>
                        <img src={logo} alt="logo" className='image' />
                    </div>

                    <nav>
                        <ul>
                            <li>
                                <Link to="/">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"
                                    >
                                        <path
                                            fill="#1E0D03"
                                            d="m20 8-6-5.26a3 3 0 0 0-4 0L4 8a3 3 0 0 0-1 2.26V19a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-8.75A3 3 0 0 0 20 8Zm-6 12h-4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5Zm5-1a1 1 0 0 1-1 1h-2v-5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v5H6a1 1 0 0 1-1-1v-8.75a1 1 0 0 1 .34-.75l6-5.25a1 1 0 0 1 1.32 0l6 5.25a1.002 1.002 0 0 1 .34.75V19Z"
                                            opacity={0.6}
                                        />
                                    </svg>
                                    <span> Trang chủ</span>

                                </Link>
                            </li>
                            <li>
                                <Link to="/ticket-mng">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"

                                    >
                                        <path
                                            fill="#1E0D03"
                                            d="M9 10a1 1 0 0 0-1 1v2a1 1 0 1 0 2 0v-2a1 1 0 0 0-1-1Zm12 1a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1 1 1 0 0 1 0 2 1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1 1 1 0 0 1 0-2Zm-1-1.82a3 3 0 0 0 0 5.64V17H10a1 1 0 1 0-2 0H4v-2.18a3 3 0 0 0 0-5.64V7h4a1 1 0 0 0 2 0h10v2.18Z"
                                            opacity={0.6}
                                        />
                                    </svg>
                                    <span> Quản lý vé</span>
                                </Link>

                            </li>
                            <li>
                                <Link to="/ticket-change">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"

                                    >
                                        <path
                                            fill="#1E0D03"
                                            d="M13 16H7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2Zm-4-6h2a1 1 0 1 0 0-2H9a1 1 0 1 0 0 2Zm12 2h-3V3a1 1 0 0 0-1.5-.87l-3 1.72-3-1.72a1 1 0 0 0-1 0l-3 1.72-3-1.72A1 1 0 0 0 2 3v16a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1ZM5 20a1 1 0 0 1-1-1V4.73l2 1.14a1.08 1.08 0 0 0 1 0l3-1.72 3 1.72a1.08 1.08 0 0 0 1 0l2-1.14V19a3 3 0 0 0 .18 1H5Zm15-1a1 1 0 1 1-2 0v-5h2v5Zm-7-7H7a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2Z"
                                            opacity={0.6}
                                        />
                                    </svg>
                                    <span> Đổi soát vé</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/setting">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        fill="none"
                                    >
                                        <path
                                            fill="#1E0D03"
                                            d="M19.9 12.66a1 1 0 0 1 0-1.32l1.28-1.44a1 1 0 0 0 .12-1.17l-2-3.46a1 1 0 0 0-1.07-.48l-1.88.38a1 1 0 0 1-1.15-.66l-.61-1.83a1 1 0 0 0-.95-.68h-4a1 1 0 0 0-1 .68l-.56 1.83a1 1 0 0 1-1.15.66L5 4.79a1 1 0 0 0-1 .48L2 8.73a1 1 0 0 0 .1 1.17l1.27 1.44a1 1 0 0 1 0 1.32L2.1 14.1a1 1 0 0 0-.1 1.17l2 3.46a1 1 0 0 0 1.07.48l1.88-.38a1 1 0 0 1 1.15.66l.61 1.83a1 1 0 0 0 1 .68h4a1 1 0 0 0 .95-.68l.61-1.83a1 1 0 0 1 1.15-.66l1.88.38a1 1 0 0 0 1.07-.48l2-3.46a1 1 0 0 0-.12-1.17l-1.35-1.44ZM18.41 14l.8.9-1.28 2.22-1.18-.24a3 3 0 0 0-3.45 2L12.92 20h-2.56L10 18.86a3 3 0 0 0-3.45-2l-1.18.24-1.3-2.21.8-.9a3 3 0 0 0 0-4l-.8-.9 1.28-2.2 1.18.24a3 3 0 0 0 3.45-2L10.36 4h2.56l.38 1.14a3 3 0 0 0 3.45 2l1.18-.24 1.28 2.22-.8.9a3 3 0 0 0 0 3.98Zm-6.77-6a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                                            opacity={0.6}
                                        />
                                    </svg>
                                    <span> Cài đặt</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                </div>
                <div className='content'>

                    <Routes>
                        <Route path="/" element={
                            <>
                                <div className='content-inside'>
                                    <div className='ct-1'>
                                        <h2>Trang chủ</h2>
                                    </div>
                                    <div className='ct-2'>
                                        <p>đây là trang chủ</p>
                                    </div>
                                    <div className='ct-3'>
                                        <div className='add-btn'>

                                        </div>
                                    </div>
                                </div>
                            </>

                        } />
                        <Route path="/ticket-mng" element={
                            <>
                                <div className='content-inside'>
                                    <div className='ct-1'>
                                        <h2>Danh sách vé</h2>
                                    </div>
                                    <div className='ct-2'>
                                        <DatVe></DatVe>
                                    </div>
                                    <div className='ct-3'>
                                    </div>
                                </div>
                            </>

                        } />
                        <Route path="/ticket-change" element={<>
                            <div className='content-inside'>
                                <div className='ct-1'>
                                    <h2>Đổi soát vé</h2>
                                </div>
                                <div className='ct-2'>
                                    <DoiVe></DoiVe>
                                </div>
                                <div className='ct-3'>
                                </div>
                            </div>
                        </>
                        } />
                        <Route path="/setting" element={<>
                            <div className='content-inside'>
                                <div className='ct-1'>
                                    <h2>Danh sách gói vé</h2>
                                </div>
                                <div className='ct-2'>
                                    <p>Đây là trang danh sách gói vé</p>
                                </div>
                                <div className='ct-3'>
                                </div>
                            </div>
                        </>
                        } />
                    </Routes>
                </div>
            </div>

            
   
        </BrowserRouter >
    );
};

export default MenuBar;