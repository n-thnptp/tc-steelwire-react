import query from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ error: 'No session found' });
    }

    try {
        const [session] = await query(
            `SELECT 
                u.c_id, 
                u.email, 
                u.role_id
            FROM sessions s 
            JOIN user u ON s.c_id = u.c_id 
            WHERE s.session_id = ? AND s.expiration > NOW()`,
            [sessionId]
        );


        if (!session) {

            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        return res.status(200).json({ 
            user: {
                id: session.c_id,
                email: session.email,
                role_id: session.role_id
            }
        });
    } catch (error) {
        console.error('Session validation error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}