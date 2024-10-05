import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import LoginForm from "./Components/LoginForm/LoginForm";
import Homepage from "./Components/Homepage/Homepage";
import OrderForm from './Components/OrderPage/OderForm';

const Purchase = () => <h2>Purchase Page</h2>;
const Status = () => <h2>Status Page</h2>;
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
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/status" element={<Status />} />
        <Route path="/configuration" element={<Configuration />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<LoginForm />} />
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
