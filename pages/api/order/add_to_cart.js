import query from '../../../lib/db'

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        customer_id,
        products
    } = req.body

    try {
        // First, get or create cart for user
        let cartResult = await query(
            'SELECT cart_id FROM cart WHERE c_id = ?',
            [customer_id]
        );

        let cart_id;
        if (cartResult.length === 0) {
            // Create new cart if doesn't exist
            const result = await query(
                'INSERT INTO cart (c_id) VALUES (?)',
                [customer_id]
            );
            cart_id = result.insertId;
        } else {
            cart_id = cartResult[0].cart_id;
        }

        for (const product of products) {

            const getShopMaterialId = await query(
                `SELECT
                    sm_id,
                    mt_id,
                    ms_id
                FROM shop_material
                WHERE mt_id = ?
                AND ms_id = ?`,
                [product.mt_id, product.ms_id]
            )

            const productResult = await query(
                `INSERT INTO product (feature, weight, length, sm_id)
                 VALUES (?, ?, ?, ?)`,
                [product.feature, product.weight, product.length, getShopMaterialId[0].sm_id]
            );

            const product_id = productResult.insertId;

            await query(
                `
                INSERT INTO cart_product (cart_id, p_id)
                VALUES (?, ?)
                `,
                [cart_id, product_id]
            )
        }

        res.status(201).json({
            success: true,
            message: 'Orders added to cart!'
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}