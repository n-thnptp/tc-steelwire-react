import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
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

        const userId = sessions[0].c_id;
        const { address, tambon } = req.body;

        if (!tambon) {
            return res.status(400).json({ error: 'Invalid tambon ID' });
        }

        // Get province ID for the selected tambon
        const provinceResult = await query(`
            SELECT p.province_id 
            FROM tambons t
            JOIN amphurs a ON t.amphur_id = a.amphur_id
            JOIN provinces p ON a.province_id = p.province_id
            WHERE t.tambon_id = ?`,
            [tambon]
        );

        if (provinceResult.length > 0) {
            const provinceId = provinceResult[0].province_id;
            const freeShippingProvinces = [1, 2, 3, 4, 58, 59];
            const newShippingFee = freeShippingProvinces.includes(provinceId) ? 0 : 3500;

            // First get all orders with status = 1 and their current shipping fees
            const pendingOrders = await query(
                'SELECT o_id, o_total_price, shipping_fee FROM `order` WHERE c_id = ? AND o_status_id = 1',
                [userId]
            );

            // Update shipping fee and total price for each order
            for (const order of pendingOrders) {
                const oldShippingFee = order.shipping_fee || 0;
                const basePrice = order.o_total_price - oldShippingFee; // Remove old shipping fee
                const newTotalPrice = basePrice + newShippingFee; // Add new shipping fee

                await query(
                    'UPDATE `order` SET shipping_fee = ?, o_total_price = ? WHERE o_id = ?',
                    [newShippingFee, newTotalPrice, order.o_id]
                );
            }
        }

        // Rest of the address update logic
        const userResult = await query(
            'SELECT sh_id FROM user WHERE c_id = ?',
            [userId]
        );

        const shippingAddressId = userResult[0]?.sh_id;

        if (!shippingAddressId) {
            const result = await query(
                'INSERT INTO shipping_address (tambon_id, address) VALUES (?, ?)',
                [tambon, address]
            );

            await query(
                'UPDATE user SET sh_id = ? WHERE c_id = ?',
                [result.insertId, userId]
            );
        } else {
            await query(
                'UPDATE shipping_address SET tambon_id = ?, address = ? WHERE sh_id = ?',
                [tambon, address || '', shippingAddressId]
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
            user: users[0]
        });
    } catch (error) {
        console.error('Update address error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}