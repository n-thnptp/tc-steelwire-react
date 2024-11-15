import query from '../../../lib/db';

export default async function handler(req, res) {
    
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get user ID from sessions table
        const sessions = await query(
            'SELECT c_id FROM sessions WHERE session_id = ? AND expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const userId = sessions[0].c_id;

        // Get user details including shipping address
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
            LEFT JOIN shipping_address sa ON u.sh_id = sa.sh_id
            LEFT JOIN tambons t ON sa.tambon_id = t.tambon_id
            LEFT JOIN amphurs am ON t.amphur_id = am.amphur_id
            LEFT JOIN provinces p ON am.province_id = p.province_id
            WHERE u.c_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Format the response
        const formattedUser = {
            c_id: user.c_id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            phone_number: user.phone_number,
            company: user.company,
            address: user.address || '',
            tambon: user.tambon_name || '',
            amphur: user.amphur_name || '',
            province: user.province_name || '',
            postalCode: user.zip_code || ''
        };

        return res.status(200).json({ user: formattedUser });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}