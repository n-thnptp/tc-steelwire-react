import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { mt_id, ms_id, weight } = req.body;

    try {
        // Get shop material details with correct column names
        const [material] = await query(
            `SELECT 
                sm.total_amount,
                sm.min_amount,
                mt.name as mt_name,
                ms.size as size
            FROM shop_material sm
            INNER JOIN material_type mt ON sm.mt_id = mt.mt_id
            INNER JOIN material_size ms ON sm.ms_id = ms.ms_id
            WHERE sm.mt_id = ? AND sm.ms_id = ?
            LIMIT 1`,
            [mt_id, ms_id]
        );

        if (!material) {
            return res.status(404).json({ 
                success: false,
                message: 'Material not found' 
            });
        }

        const currentStock = parseFloat(material.total_amount);
        const minAmount = parseFloat(material.min_amount);
        const requestedWeight = parseFloat(weight);

        // Check if stock is below or equal to minimum amount
        if (currentStock <= minAmount) {
            return res.status(400).json({ 
                success: false,
                message: `${material.mt_name} ขนาด ${material.size}mm หมดสต็อก (คงเหลือ ${currentStock} kg)` 
            });
        }

        // Check if remaining stock after purchase would be below minimum
        if ((currentStock - requestedWeight) <= minAmount) {
            const availableWeight = Math.max(0, currentStock - minAmount);
            return res.status(400).json({ 
                success: false,
                message: `${material.mt_name} ขนาด ${material.size}mm มีสต็อกไม่เพียงพอ สามารถสั่งได้สูงสุด ${availableWeight.toFixed(2)} kg` 
            });
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