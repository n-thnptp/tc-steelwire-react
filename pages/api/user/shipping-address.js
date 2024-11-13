import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get user ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        // Get user's shipping address and province
        const addressResult = await query(`
            SELECT c.c_id, c.firstname, c.lastname, 
                   sa.tambon_id, sa.address, 
                   am.name_th, p.name_th, p.province_id,
                   t.name_th AS tambon_name, 
                   am.name_th AS amphur_name, 
                   p.name_th AS province_name
            FROM customer c
            JOIN shipping_address sa ON c.sh_id = sa.sh_id
            JOIN tambons t ON sa.tambon_id = t.tambon_id
            JOIN amphurs am ON t.amphur_id = am.amphur_id
            JOIN provinces p ON am.province_id = p.province_id
            WHERE c.c_id = ?
        `, [customerId]);

        if (addressResult.length === 0) {
            return res.status(404).json({ error: 'Shipping address not found' });
        }

        return res.status(200).json({
            success: true,
            ...addressResult[0]
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 