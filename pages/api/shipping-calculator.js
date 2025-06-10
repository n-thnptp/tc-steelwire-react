import { calculateShippingFee } from '../../lib/shipping-calculator';

export default async function shippingCalculatorHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            message: 'Method not allowed' 
        });
    }

    try {
        const { searchTerm } = req.body;
        
        if (!searchTerm) {
            return res.status(400).json({
                success: false,
                message: 'Search term is required'
            });
        }

        const result = await calculateShippingFee(searchTerm);

        return res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Shipping calculation error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate shipping fee'
        });
    }
} 