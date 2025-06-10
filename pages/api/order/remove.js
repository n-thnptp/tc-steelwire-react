import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { customer_id, total_price, products } = req.body;

    // Start transaction
    let connection;
    try {
        connection = await query('START TRANSACTION');

        // Create order
        const orderResult = await query(
            `INSERT INTO \`order\` (c_id, o_date, o_status_id, o_total_price, o_estimated_shipping_day)
             VALUES (?, CURRENT_DATE(), 1, ?, 3)`,
            [customer_id, total_price]
        );

        const order_id = orderResult.insertId;

        // Create products and link them to order
        for (const product of products) {
            // First create the product
            const productResult = await query(
                `INSERT INTO product (feature, weight, length, sm_id)
                 VALUES (?, ?, ?, ?)`,
                [product.feature, product.weight, product.length, product.sm_id]
            );

            const product_id = productResult.insertId;

            // Then link it to the order
            await query(
                `INSERT INTO order_product (o_id, p_id)
                 VALUES (?, ?)`,
                [order_id, product_id]
            );
        }

        // Commit transaction
        await query('COMMIT');

        res.status(201).json({
            success: true,
            data: { order_id }
        });

    } catch (error) {
        // Rollback transaction on error
        if (connection) {
            await query('ROLLBACK');
        }
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating order'
        });
    }
}
