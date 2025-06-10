import { LoginProvider } from '../components/Context/LoginContext'
import { CartProvider } from '../components/Context/CartContext'
import { FormProvider } from '../components/Context/RegisterContext' // Updated import path
import { OrderProvider } from '../components/Context/OrderContext'
import Navbar from '../components/Navbar'
import NavbarManager from '../components/NavbarManager'
import { useRouter } from 'next/router'
// Import global styles
import '../styles/globals.css'
import '../styles/RegisterForm.css';

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const shouldShowNavbar = !['/login', '/signup'].includes(router.pathname)
    const isLoginPage = router.pathname === '/login'
    const isManagerPage = router.pathname.includes('/manager')

    return (
        <LoginProvider>
            <CartProvider>
                <OrderProvider>
                    <div className={`min-h-screen ${!isLoginPage ? 'bg-secondary' : 'bg-primary'}`}>
                        {shouldShowNavbar && (isManagerPage ? <NavbarManager /> : <Navbar />)}
                        <Component {...pageProps} />
                    </div>
                </OrderProvider>
            </CartProvider>
        </LoginProvider>
    )
}

export default MyApp