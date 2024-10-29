import { LoginProvider } from '../components/Context/LoginContext'
import { CartProvider } from '../components/Context/CartContext'
import Navbar from '../components/Navbar'
import NavbarManager from '../components/NavbarManager'
import { useRouter } from 'next/router'
// Import global styles
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
    const router = useRouter()
    const shouldShowNavbar = !['/login', '/signup'].includes(router.pathname)
    const isLoginPage = router.pathname === '/login'
    const isManagerPage = router.pathname.includes('/manager')

    return (
        <LoginProvider>
            <CartProvider>
                <div className={`min-h-screen ${!isLoginPage ? 'bg-secondary' : 'bg-primary'}`}>
                    {shouldShowNavbar && (isManagerPage ? <NavbarManager /> : <Navbar />)}
                    <Component {...pageProps} />
                </div>
            </CartProvider>
        </LoginProvider>
    )
}

export default MyApp