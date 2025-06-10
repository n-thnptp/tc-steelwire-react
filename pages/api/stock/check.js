import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { products } = req.body;

        if (!products || !Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request: products array is required'
            });
        }


        for (const product of products) {
            if (!product.mt_id || !product.ms_id || !product.weight) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid product data: mt_id, ms_id, and weight are required'
                });
            }

            const [material] = await query(`
                SELECT 
                    sm.total_amount,
                    sm.min_amount,
                    mt.name as mt_name,
                    ms.size
                FROM shop_material sm
                JOIN material_type mt ON sm.mt_id = mt.mt_id
                JOIN material_size ms ON sm.ms_id = ms.ms_id
                WHERE sm.mt_id = ? AND sm.ms_id = ?
            `, [product.mt_id, product.ms_id]);

            if (!material) {
                return res.status(400).json({
                    success: false,
                    message: `Material not found for type ${product.mt_id} and size ${product.ms_id}`
                });
            }

            const currentStock = parseFloat(material.total_amount);
            const requestedWeight = parseFloat(product.weight);
            const minAmount = parseFloat(material.min_amount);

            if ((currentStock - requestedWeight) < minAmount) {
                const availableWeight = Math.max(0, currentStock - minAmount);
                return res.status(400).json({
                    success: false,
                    message: `${material.mt_name} ขนาด ${material.size}mm มีสต็อกไม่เพียงพอ สามารถสั่งได้สูงสุด ${availableWeight.toFixed(2)} kg`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Stock available'
        });

    } catch (error) {
        console.error('Stock check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
} 