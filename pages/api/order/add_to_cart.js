import query from '../../../lib/db'

// Utility function to generate numeric IDs
function generateNumericId(length) {
    let result = '';
    result += Math.floor(Math.random() * 9) + 1; // First digit non-zero
    for (let i = 1; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

async function generateUniqueCartId() {
    while (true) {
        const cart_id = generateNumericId(6);
        const existing = await query('SELECT cart_id FROM cart WHERE cart_id = ?', [cart_id]);
        if (existing.length === 0) return cart_id;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const {
        customer_id,
        products
    } = req.body

    try {

        const createCart = await query(
            `
                INSERT INTO cart (c_id) VALUES (?)
            `,
            [customer_id]
        );

        const cart_id = createCart.insertId;

        for (const product of products) {

            const productResult = await query(
                `INSERT INTO product (feature, weight, length, sm_id)
                 VALUES (?, ?, ?, ?)`,
                [product.feature, product.weight, product.length, product.sm_id]
            );

            const product_id = productResult.insertId;

            await query(
                `INSERT INTO cart_product (cart_id, p_id)
                 VALUES (?, ?)`,
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