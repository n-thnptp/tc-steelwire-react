import query from '../../../lib/db';
import { calculateShippingFee } from '../../../lib/shipping-calculator';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    console.log('Request body:', req.body);

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
        const { address, tambon, amphur, province, zipCode } = req.body;

        if (!tambon) {
            return res.status(400).json({ error: 'Invalid tambon ID' });
        }

        // Get tambon name and location data
        const locationData = await query(`
            SELECT 
                t.tambon_id,
                t.name_th as tambon_name,
                a.name_th as amphur_name,
                p.name_th as province_name,
                t.zip_code,
                a.amphur_id,
                p.province_id
            FROM tambons t
            JOIN amphurs a ON t.amphur_id = a.amphur_id
            JOIN provinces p ON a.province_id = p.province_id
            WHERE t.tambon_id = ?`,
            [tambon]
        );

        console.log('Database result:', locationData[0]);

        if (!locationData.length) {
            return res.status(400).json({ error: 'Invalid tambon ID' });
        }

        const { 
            tambon_name, 
            amphur_name, 
            province_name, 
            zip_code, 
            amphur_id, 
            province_id 
        } = locationData[0];

        // Create search term
        const searchTerm = `ตำบล${tambon_name} อำเภอ${amphur_name} จังหวัด${province_name}`;
        
        // Get coordinates and shipping fee
        const { distance, shippingFee, coordinates } = await calculateShippingFee(searchTerm);

        // Save coordinates
        const userResult = await query(
            'SELECT sh_id FROM user WHERE c_id = ?',
            [userId]
        );

        const shippingAddressId = userResult[0]?.sh_id;

        if (shippingAddressId) {
            await query(
                `UPDATE shipping_address 
                 SET latitude = ?, 
                     longitude = ?,
                     tambon_id = ?,
                     amphur_id = ?,
                     province_id = ?,
                     zip_code = ?,
                     address = ?
                 WHERE sh_id = ?`,
                [
                    coordinates.lat,
                    coordinates.lng,
                    tambon,
                    amphur_id,
                    province_id,
                    zip_code,
                    address || '',
                    shippingAddressId
                ]
            );
        } else {
            const result = await query(
                `INSERT INTO shipping_address 
                (latitude, longitude, tambon_id, amphur_id, province_id, zip_code, address) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    coordinates.lat,
                    coordinates.lng,
                    tambon,
                    amphur_id,
                    province_id,
                    zip_code,
                    address
                ]
            );

            await query(
                'UPDATE user SET sh_id = ? WHERE c_id = ?',
                [result.insertId, userId]
            );
        }

        // First get the current order details
        const orders = await query(
            `SELECT o_id, subtotal FROM \`order\` 
             WHERE c_id = ? AND o_status_id = 1`,
            [userId]
        );

        // Then update with correct calculations
        for (const order of orders) {
            await query(
                `UPDATE \`order\` 
                 SET shipping_fee = ?,
                     o_total_price = subtotal + ?
                 WHERE o_id = ?`,
                [shippingFee, shippingFee, order.o_id]
            );
        }

        // Get updated user data
        const users = await query(
            `SELECT
                u.c_id,
                u.firstname,
                u.lastname,
                u.email,
                u.phone_number,
                u.company,
                sa.tambon_id,
                sa.address,
                t.name_th AS tambon_name,
                am.name_th AS amphur_name,
                p.name_th AS province_name,
                t.zip_code AS zip_code
            FROM user u
            JOIN shipping_address sa ON u.sh_id = sa.sh_id
            JOIN tambons t ON sa.tambon_id = t.tambon_id
            JOIN amphurs am ON t.amphur_id = am.amphur_id
            JOIN provinces p ON am.province_id = p.province_id
            WHERE u.c_id = ?`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            user: users[0],
            distance,
            shippingFee,
            inFreeRadius: distance <= 80
        });
    } catch (error) {
        console.error('Update address error:', error);
        return res.status(500).json({ error: error.message });
    }
}