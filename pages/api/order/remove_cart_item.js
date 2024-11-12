import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        user_id,
        product_id
    } = req.body;

    if (!user_id || !product_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Grab all customer cart ID using user_id
        const getCartId = await query(
            `
            SELECT
                cart_product.cart_id,
                cart_product.p_id,
                cart.c_id
            FROM cart_product
            JOIN cart ON cart_product.cart_id = cart.cart_id
            WHERE c_id = ?
            AND p_id = ?
            `,
            [user_id, product_id]
        );
        const cart_id = getCartId[0].cart_id;
        console.log(getCartId);
        console.log(getCartId[0].cart_id);

        // First remove the product from cart
        await query(
            `
            DELETE FROM cart_product
            WHERE cart_id = ?
            AND p_id = ?
            `,
            [cart_id, product_id]
        );

        // Then remove the product
        await query(
            `DELETE FROM product
             WHERE p_id = ?`,
            [product_id]
        );

        // Finally, remove the cart
        await query(
            `
            DELETE FROM cart
            WHERE cart_id = ?
            AND c_id = ?
            `,
            [cart_id, user_id]
        );

        res.status(200).json({
            success: true,
            message: 'Item removed successfully'
        });

    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}