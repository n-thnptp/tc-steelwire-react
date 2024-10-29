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
        const { firstname, lastname, email, phone_number } = req.body;

        // Update customer information
        await query(
            `UPDATE customer 
             SET firstname = ?, 
                 lastname = ?, 
                 email = ?, 
                 phone_number = ?
             WHERE c_id = ?`,
            [firstname, lastname, email, phone_number, userId]
        );

        // Get updated user data
        const users = await query(
            `SELECT 
                c.c_id,
                c.firstname,
                c.lastname,
                c.email,
                c.phone_number
             FROM customer c
             WHERE c.c_id = ?`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Update personal info error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}