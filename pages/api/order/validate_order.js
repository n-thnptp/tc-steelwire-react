import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { products } = req.body;

    try {
        // Check if all required shop_materials exist and have sufficient stock
        for (const product of products) {
            const material = await query(
                'SELECT total_amount FROM shop_material WHERE sm_id = ?',
                [product.sm_id]
            );

            if (!material) {
                return res.status(400).json({
                    success: false,
                    message: `Material with ID ${product.sm_id} not found`
                });
            }

            if (material.amount_left < product.weight) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for material ID ${product.sm_id}`
                });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Order validation successful'
        });

    } catch (error) {
        console.error('Error validating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error validating order'
        });
    }
}
