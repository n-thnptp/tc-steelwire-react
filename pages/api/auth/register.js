import { serialize } from 'cookie';
import query from '../../../lib/db';
import { hashPassword, generateSessionId } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Log received data
        console.log('Request body:', req.body);

        const {
            email,
            password,
            firstName,
            lastName,
            companyName,
            phoneNumber,
            address,
            province, // ID String
            amphur, // ID String
            tambon, // ID String
            postcode
        } = req.body;
        // Validate required fields
        if (!email || !password || !firstName || !lastName || !phoneNumber || !address || !province || !amphur || !tambon || !postcode) {
            return res.status(400).json({
                error: 'Missing fields',
                message: 'Please fill in all required fields'
            });
        }

        // Check if user exists
        console.log('Checking existing user:', email);
        const existingUsers = await query(
            'SELECT email FROM user WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                error: 'Account exists',
                message: 'An account with this email already exists'
            });
        }

        // Find tambon based on tambon name
        console.log('Looking up tambon for tambon:', tambon);
        const tambonQuery = `
            SELECT * from tambons 
            WHERE amphur_id = ?
            AND amphur_id IN (SELECT amphur_id FROM amphurs WHERE province_id = ?)
        `;
        const tambons = await query(tambonQuery, [amphur, province]);
        console.log('Found tambons:', tambons);

        if (!tambons || tambons.length === 0) {
            return res.status(400).json({
                error: 'Invalid tambon',
                message: 'tambon not found in our database'
            });
        }

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await hashPassword(password);
        // Create shipping address
        console.log('Creating shipping address...');
        console.log(tambons)
        const addressResult = await query(
            'INSERT INTO shipping_address (tambon_id, address) VALUES (?, ?)',
            [tambons[0].tambon_id, address]
        );
        console.log('Shipping address created:', addressResult);

        // Get the auto-generated sh_id
        const shippingId = addressResult.insertId;
        

        // Create customer record
        console.log('Creating customer record...');
        const customerResult = await query(
            `INSERT INTO user (
                firstname,
                lastname,
                email,
                password_hashed,
                phone_number,
                company,
                sh_id,
                role
            ) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                firstName,
                lastName,
                email,
                hashedPassword,
                phoneNumber,
                companyName || null,
                shippingId,
                'customer'
            ]
        );
        console.log('Customer created:', customerResult);

        // Create session
        const sessionId = generateSessionId();
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await query(
            'INSERT INTO sessions (session_id, c_id, expiration) VALUES (?, ?, ?)',
            [sessionId, customerResult.insertId, expirationDate]
        );

        // Set session cookie
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

        return res.status(201).json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            sqlMessage: error.sqlMessage
        });

        return res.status(500).json({
            error: 'Registration failed',
            message: process.env.NODE_ENV === 'development'
                ? `Registration failed: ${error.message}`
                : 'Registration failed. Please try again.'
        });
    }
}