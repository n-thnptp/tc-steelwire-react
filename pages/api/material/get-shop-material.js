import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { mt_id, ms_id } = req.body;

    try {
        // Validate input
        if (!mt_id || !ms_id) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        // Get shop material details
        const [material] = await query(
            `SELECT 
                sm_id,
                mt_id,
                ms_id,
                total_amount,
                min_amount
            FROM shop_material
            WHERE mt_id = ? AND ms_id = ?
            LIMIT 1`,
            [mt_id, ms_id]
        );

        if (!material) {
            return res.status(404).json({
                success: false,
                message: 'Material not found'
            });
        }

        return res.status(200).json({
            success: true,
            material: material
        });

    } catch (error) {
        console.error('Error fetching shop material:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
} 