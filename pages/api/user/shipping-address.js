import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;

    try {
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (!sessions || sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const customerId = sessions[0].c_id;

        const addressResult = await query(`
            SELECT 
                c.firstname, 
                c.lastname,
                c.phone_number,
                sa.address,
                p.province_id,
                t.name_th AS tambon_name,
                am.name_th AS amphur_name,
                p.name_th AS province_name,
                t.zip_code
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
        
        return res.status(200).json({
            success: true,
            address: {
                customer_name: `${address.firstname} ${address.lastname}`,
                full_address: `${address.address} ตำบล${address.tambon_name} อำเภอ${address.amphur_name} จังหวัด${address.province_name} ${address.zip_code}`,
                tambon_name: address.tambon_name,
                amphur_name: address.amphur_name,
                province_name: address.province_name,
                phone: address.phone_number || '',
            },
            province_id: address.province_id
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error fetching shipping address'
        });
    }
} 