import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const order = await query(
        `
        SELECT 
            o.o_id, 
            o.c_id, 
            o.o_date, 
            o.o_status_id as status, 
            o.o_total_price, 
            o.o_estimated_shipping_day, 
            o.courier_id,
            c.name as courier_name
        FROM \`order\` o
        LEFT JOIN courier c ON o.courier_id = c.courier_id
        `
        );

        return res.status(200).json({ order });

    } catch (error) {
        console.error('fetch order error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}