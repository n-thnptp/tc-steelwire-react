import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderId } = req.query;
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get customer ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (!sessions || sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        // Get order details including customer info with proper address
        const orderDetails = await query(`
            SELECT 
                o.o_id,
                o.o_total_price,
                o.shipping_fee,
                o.o_date,
                o.o_status_id,
                c.firstname,
                c.lastname,
                sa.address,
                t.name_th AS tambon_name,
                am.name_th AS amphur_name,
                p.name_th AS province_name,
                cr.name as courier_name,
                cr.courier_id
            FROM \`order\` o
            JOIN user c ON o.c_id = c.c_id
            JOIN shipping_address sa ON c.sh_id = sa.sh_id
            JOIN tambons t ON sa.tambon_id = t.tambon_id
            JOIN amphurs am ON t.amphur_id = am.amphur_id
            JOIN provinces p ON am.province_id = p.province_id
            LEFT JOIN courier cr ON o.courier_id = cr.courier_id
            WHERE o.o_id = ? AND o.c_id = ?`,
            [orderId, customerId]
        );

        if (orderDetails.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Format the response
        const order = orderDetails[0];
        const formattedOrder = {
            ...order,
            customer_name: `${order.firstname} ${order.lastname}`,
            address: `${order.address} ${order.tambon_name} ${order.amphur_name} ${order.province_name}`,
        };

        return res.status(200).json({
            success: true,
            order: formattedOrder
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching order details'
        });
    }
} 