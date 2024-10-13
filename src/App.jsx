import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginForm from "./Components/LoginForm/LoginForm";
import RegisterForm from "./Components/LoginForm/RegisterForm";
import Homepage from "./Components/Homepage/Homepage";
import OrderForm from './Components/OrderPage/OrderForm';
import PurchasePage from './Components/PurchasePage/PurchasePage';
import PaymentPage from './Components/PurchasePage/PaymentPage/PaymentPage';
import EditAddress from './Components/PurchasePage/EditAddress';
import Status from './Components/StatusPage/Status';
import HistoryPage from './Components/HistoryPage/HistoryPage';

const Configuration = () => <h2>Configuration Page</h2>;
const History = () => <h2>History Page</h2>;

function App() {
  const location = useLocation();

  // ตรวจสอบเส้นทางที่เป็น "/login" และ "/signup" เพื่อซ่อน Navbar
  const shouldShowNavbar = !['/login', '/signup'].includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}  {/* แสดง Navbar เฉพาะเมื่อเส้นทางไม่ใช่ /login หรือ /signup */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order" element={<OrderForm />} />
        <Route path="/purchase" element={<PurchasePage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/editAddress" element={<EditAddress />} />
        <Route path="/status" element={<Status />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<RegisterForm />} />
      </Routes>
    </>
  );
}

export default function MainApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
