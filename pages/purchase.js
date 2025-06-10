import PurchasePage from '../components/PurchasePage/PurchasePage';
import { CartProvider } from '../components/Context/CartContext';

export default function Purchase() {
    return (
        <CartProvider>
            <PurchasePage />
        </CartProvider>
    );
}