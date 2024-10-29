import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const connection = await query('SELECT 1'); // Get connection from pool

    try {
        // Get user ID from session
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const userId = sessions[0].c_id;
        const { address, tambonId } = req.body;

        // Check if user already has a shipping address
        const userResult = await query(
            'SELECT sh_id FROM customer WHERE c_id = ?',
            [userId]
        );

        let shippingAddressId = userResult[0]?.sh_id;

        if (!shippingAddressId) {
            // Create new shipping address
            const result = await query(
                'INSERT INTO shipping_address (tambon_id, address) VALUES (?, ?)',
                [tambonId, address]
            );
            shippingAddressId = result.insertId;

            // Update customer with new shipping address ID
            await query(
                'UPDATE customer SET sh_id = ? WHERE c_id = ?',
                [shippingAddressId, userId]
            );
        } else {
            console.log('Update params before check:', [tambonId, address, shippingAddressId]);
            
            // Validate parameters before query
            if (!tambonId) {
                return res.status(400).json({ error: 'Invalid tambon ID' });
            }
        
            // Update existing shipping address
            await query(
                `
                UPDATE shipping_address
                SET tambon_id = ?,
                    address = ?
                WHERE sh_id = ?
                `,
                [tambonId, address || '', shippingAddressId]
            );
        }

        // Get updated user data
        const users = await query(
            `SELECT 
                c.c_id,
                sa.address,
                t.name_th as tambon,
                a.name_th as amphur,
                p.name_th as province,
                t.zip_code as postalCode
            FROM customer c
            LEFT JOIN shipping_address sa ON c.sh_id = sa.sh_id
            LEFT JOIN tambons t ON sa.tambon_id = t.tambon_id
            LEFT JOIN amphurs a ON t.amphur_id = a.amphur_id
            LEFT JOIN provinces p ON a.province_id = p.province_id
            WHERE c.c_id = ?`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Update address error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}