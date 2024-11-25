import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        const [userIdCheck] = await query('SELECT @current_user_id as current_user_id');
        console.log('Current user_id in order validation:', userIdCheck.current_user_id);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
        
    }

    const { products } = req.body;

    try {
        // Check if all required shop_materials exist and have sufficient stock
        // CONTINUE FROM THIS, MAKE CHECKS IF THE TOTAL_AMOUNT IS ENOUGH &&
        // IF IT HITS MIN_AMOUNT
        for (const product of products) {
            const material = await query(
                `SELECT
                    sm_id,
                    mt_id,
                    ms_id,
                    total_amount,
                    min_amount
                FROM shop_material
                WHERE mt_id = ?
                AND ms_id = ?`,
                [product.mt_id, product.ms_id]
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
