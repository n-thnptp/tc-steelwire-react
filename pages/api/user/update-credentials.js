import query from '../../../lib/db';
import { hashPassword, validatePassword } from '../../../lib/auth';
import { parse } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let sessionId;
    if (req.headers.cookie) {
        const cookies = parse(req.headers.cookie);
        sessionId = cookies.sessionId;
        console.log('Parsed sessionId:', sessionId);
    }

    if (!sessionId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        // Get user ID from session and validate
        const sessions = await query(
            `SELECT 
                s.c_id,
                u.password_hashed
            FROM sessions s
            JOIN user u ON s.c_id = u.c_id
            WHERE s.session_id = ? AND s.expiration > NOW()`,
            [sessionId]
        );

        console.log('Session query result:', sessions);

        if (sessions.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired session' });
        }

        const userId = sessions[0].c_id;
        const { oldPassword, newPassword } = req.body;


        // Validate old password using the validatePassword function from auth.js
        const isPasswordValid = await validatePassword(oldPassword, sessions[0].password_hashed);
        if (!isPasswordValid) {
            return res.status(400).json({
                error: 'Current password is incorrect. Please try again.'
            });
        }

        // Hash the new password using the hashPassword function from auth.js
        const hashedNewPassword = await hashPassword(newPassword);

        // Update the password in the database
        await query(
            'UPDATE user SET password_hashed = ? WHERE c_id = ?',
            [hashedNewPassword, userId]
        );

        // Remove all sessions for this user to force re-login
        await query(
            'DELETE FROM sessions WHERE c_id = ?',
            [userId]
        );

        // Clear the session cookie
        res.setHeader('Set-Cookie', [
            `sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`
        ]);

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully. Please login again.',
            requireRelogin: true
        });

    } catch (error) {
        console.error('Update credentials error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}