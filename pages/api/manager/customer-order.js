import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const order = await query(
        `
        SELECT 
            o_id, 
            c_id, 
            o_date, 
            o_status_id as status, 
            o_total_price, 
            o_estimated_shipping_day, 
            courier_id
        FROM \`order\`
        `
        );

        console.log(order);
        return res.status(200).json({ order });

    } catch (error) {
        console.error('fetch order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}