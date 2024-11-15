import query from '../../../lib/db';
import { validatePassword, generateSessionId } from '../../../lib/auth';
import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        
   

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                error: 'Missing credentials',
                message: 'Email and password are required'
            });
        }

        // 1. Get user from database
        const [user] = await query(
            'SELECT c_id, email, password_hashed, role_id FROM user WHERE LOWER(email) = LOWER(?)',
            [email]
        );

        // Debug: Log the query results


        if (!user) {
            return res.status(200).json({ 
                error: 'Account not found',
                message: 'This email is not registered. Would you like to create a new account?',
                code: 'ACCOUNT_NOT_FOUND'
            });
        }

        // 2. Validate password
        const isValidPassword = await validatePassword(password, user.password_hashed);
        if (!isValidPassword) {
            return res.status(200).json({ 
                error: 'Invalid password',
                message: 'The password you entered is incorrect. Please try again.',
                code: 'INVALID_PASSWORD'
            });
        }

        // 3. Clean up existing sessions
        await query(
            'DELETE FROM sessions WHERE c_id = ? OR expiration < NOW()',
            [user.c_id || null]
        );

        // 4. Create new session
        const sessionId = generateSessionId();
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        await query(
            'INSERT INTO sessions (session_id, c_id, expiration) VALUES (?, ?, ?)',
            [sessionId || null, user.c_id || null, expirationDate || null]
        );

        // 5. Set cookie and return response
        res.setHeader(
            'Set-Cookie',
            serialize('sessionId', sessionId, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: expirationDate
            })
        );

        return res.status(200).json({ 
            success: true,
            user: {
                id: user.c_id,
                email: user.email,
                role_id: user.role_id
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}