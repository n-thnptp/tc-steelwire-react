import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;

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

        // Get customer's shipping address with full location details including zip_code
        const addressResult = await query(`
            SELECT c.c_id, c.firstname, c.lastname, 
                   sa.tambon_id, sa.address, 
                   am.name_th, p.name_th, p.province_id,
                   t.name_th AS tambon_name, 
                   t.zip_code,
                   am.name_th AS amphur_name, 
                   p.name_th AS province_name
            FROM user c
            JOIN shipping_address sa ON c.sh_id = sa.sh_id
            JOIN tambons t ON sa.tambon_id = t.tambon_id
            JOIN amphurs am ON t.amphur_id = am.amphur_id
            JOIN provinces p ON am.province_id = p.province_id
            WHERE c.c_id = ?`,
            [customerId]
        );

        if (addressResult.length === 0) {
            return res.status(404).json({ error: 'Address not found' });
        }

        const address = addressResult[0];
        
        // Format the address data with zip_code
        const formattedAddress = {
            customer_name: `${address.firstname} ${address.lastname}`,
            address: `${address.address} ${address.tambon_name} ${address.amphur_name} ${address.province_name} ${address.zip_code}`,
            phone: address.phone || ''
        };

        return res.status(200).json({
            success: true,
            address: formattedAddress
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching shipping address',
            error: error.message
        });
    }
} 