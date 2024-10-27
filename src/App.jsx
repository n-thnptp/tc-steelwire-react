import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginForm from "./Components/LoginForm/LoginForm";
import { FormProvider } from "./Components/Context/RegisterContext";
import RegisterForm from "./Components/LoginForm/RegisterForm";
import Homepage from "./Components/Homepage/Homepage";
import OrderForm from './Components/OrderPage/OrderForm';
import PurchasePage from './Components/PurchasePage/PurchasePage';
import PaymentPage from './Components/PurchasePage/PaymentPage/PaymentPage';
import EditAddress from './Components/PurchasePage/EditAddress';
import Status from './Components/StatusPage/Status';
import HistoryPage from './Components/HistoryPage/HistoryPage';
import Bookmark from './Components/BookmarkPage/BookmarkPage';
import ConfigurationForm from './Components/ConfigurationPage/ConfigurationForm';
import OrderStatusDetails from './Components/StatusPage/OrderStatusDetails';
import UserSetting from './Components/Profile/UserSetting';

import NavbarManager from './Components/NavbarManager';
import OrderM from './Components/Manager/OrderM/OrderM';
import StockTable from './Components/Manager/OrderM/StockTable';



function App() {
    // ตรวจสอบเส้นทางที่เป็น "/login" และ "/signup" เพื่อซ่อน Navbar
    const shouldShowNavbar = !['/login', '/signup'].includes(location.pathname);

    // ตรวจสอบว่าอยู่ที่หน้า "/login" หรือไม่
    const isLoginPage = location.pathname === '/login';

    // ตรวจสอบว่าอยู่ที่หน้า "/manager" หรือไม่
    const isManagerPage = location.pathname.includes('/manager');

    return (
        <div className={!isLoginPage ? 'bg-secondary min-h-screen' : 'bg-primary min-h-screen'}>
            {shouldShowNavbar && (isManagerPage ? <NavbarManager /> : <Navbar />)}  {/* แสดง Navbar เฉพาะเมื่อเส้นทางไม่ใช่ /login หรือ /signup */}
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/order" element={<OrderForm />} />
                <Route path="/purchase" element={<PurchasePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/editAddress" element={<EditAddress />} />
                <Route path="/status" element={<Status />} />
                <Route path="/order-details" element={<OrderStatusDetails />} />
                <Route path="/configuration" element={<ConfigurationForm />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/bookmark" element={<Bookmark />} />
                <Route path="/profile" element={<UserSetting />} />

                {/* manager */}
                <Route path="/manager/orderM" element={<OrderM />} />
                <Route path="/manager/stock" element={<StockTable />} />

                {/* login & register pages */}
                <Route path="/login" element={<LoginForm />} />
                <Route 
                    path="/signup" 
                    element={
                        <FormProvider>
                            <RegisterForm />
                        </FormProvider>
                    } 
                />
            </Routes>
        </div>
    );
}

export default function MainApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}