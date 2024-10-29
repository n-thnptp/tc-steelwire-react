import query from '../../../lib/db';


export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            // return res.status(401).json({ 
            //     error: 'No session found',
            //     code: 'NO_SESSION'
            // });
            return res.status(200).json({
                user: null
            });
        }

        const sessions = await query(
            'SELECT c.c_id, c.email, c.firstname, c.lastname FROM sessions s ' +
            'JOIN customer c ON s.c_id = c.c_id ' +
            'WHERE s.session_id = ? AND s.expiration > NOW()',
            [sessionId]
        );

        if (sessions.length === 0) {
            // return res.status(401).json({ 
            //     error: 'Invalid or expired session',
            //     code: 'INVALID_SESSION'
            // });
            return res.status(200).json({
                user: null
            });
        }

        res.json({success: true, user: sessions[0]});
    } catch (error) {
        console.error('Session validation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}