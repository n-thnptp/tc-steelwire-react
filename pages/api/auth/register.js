import { serialize } from 'cookie';
import query from '../../../lib/db';
import { hashPassword, generateSessionId } from '../../../lib/auth';

// Utility function to generate numeric IDs
function generateNumericId(length) {
    let result = '';
    result += Math.floor(Math.random() * 9) + 1; // First digit non-zero
    for (let i = 1; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

// ID generation functions
async function generateUniqueCustomerId() {
    while (true) {
        const c_id = generateNumericId(16);
        const existing = await query('SELECT c_id FROM user WHERE c_id = ?', [c_id]);
        if (existing.length === 0) return c_id;
    }
}

async function generateUniqueShippingId() {
    while (true) {
        const sh_id = generateNumericId(11);
        const existing = await query('SELECT sh_id FROM shipping_address WHERE sh_id = ?', [sh_id]);
        if (existing.length === 0) return sh_id;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('Request body:', req.body);

        const {
            email,
            password,
            firstName,
            lastName,
            companyName,
            phoneNumber,
            address,
            province,
            amphur,
            tambon,
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

        // Find tambon
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

        // Generate unique IDs
        const customerId = await generateUniqueCustomerId();
        console.log("GENERATED CUSTOMER ID: ", customerId);
        const shippingId = await generateUniqueShippingId();
        console.log("GENERATED SHIPPING ID: ", shippingId);

        // Hash password
        console.log('Hashing password...');
        const hashedPassword = await hashPassword(password);

        // Create shipping address with generated sh_id
        console.log('Creating shipping address...');
        await query(
            'INSERT INTO shipping_address (sh_id, tambon_id, address) VALUES (?, ?, ?)',
            [shippingId, tambons[0].tambon_id, address]
        );
        console.log('Shipping address created with ID:', shippingId);

        // Create customer record with generated c_id
        console.log('Creating customer record...');
        await query(
            `INSERT INTO user (
                c_id,
                firstname,
                lastname,
                email,
                password_hashed,
                phone_number,
                company,
                sh_id,
                role_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                customerId,
                firstName,
                lastName,
                email,
                hashedPassword,
                phoneNumber,
                companyName || null,
                shippingId,
                1
            ]
        );
        console.log('Customer created with ID:', customerId);

        // Create session
        const sessionId = generateSessionId();
        const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

        await query(
            'INSERT INTO sessions (session_id, c_id, expiration) VALUES (?, ?, ?)',
            [sessionId, customerId, expirationDate]
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