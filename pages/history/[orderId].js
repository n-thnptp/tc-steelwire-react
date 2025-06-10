import { useRouter } from 'next/router';
import HistoryOrderDetail from '../../components/User/History/HistoryOrderDetail';

// This gets called at build time
export async function getStaticPaths() {
    return {
        // We'll pre-render only these paths at build time.
        // { fallback: true } means other routes will be rendered at runtime.
        paths: [],
        fallback: true
    };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    return {
        props: {
            orderId: params.orderId
        }
    };
}

export default function OrderDetailPage() {
    const router = useRouter();
    const { orderId } = router.query;

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return <HistoryOrderDetail orderId={orderId} />;
} 