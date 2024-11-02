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
                c.c_id,
                c.firstname,
                c.lastname,
                c.email,
                c.phone_number,
                c.company,
                sa.address,
                t.name_th as tambon,
                a.name_th as amphur,
                p.name_th as province,
                t.zip_code as postalCode
            FROM user c
            LEFT JOIN shipping_address sa ON c.sh_id = sa.sh_id
            LEFT JOIN tambons t ON sa.sh_id = t.tambon_id
            LEFT JOIN amphurs a ON t.amphur_id = a.amphur_id
            LEFT JOIN provinces p ON a.province_id = p.province_id
            WHERE c.c_id = ?`,
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
            tambon: user.tambon || '',
            amphur: user.amphur || '',
            province: user.province || '',
            postalCode: user.postalCode || ''
        };

        return res.status(200).json({ user: formattedUser });
    } catch (error) {
        console.error('Profile fetch error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}