import query from '../db';

export async function setCurrentUser(req) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
        await query(
            `SET @current_user_id = (
                SELECT u.c_id 
                FROM sessions s 
                JOIN user u ON s.c_id = u.c_id 
                WHERE s.session_id = ? AND s.expiration > NOW()
            )`,
            [sessionId]
        );
    }
} 