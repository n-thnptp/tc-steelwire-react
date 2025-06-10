import { serialize } from 'cookie';
import query from '../../../lib/db';
import { hashPassword, generateSessionId } from '../../../lib/auth';
import { calculateShippingFee } from '../../../lib/shipping-calculator';

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
        const c_id = generateNumericId(5);
        const existing = await query('SELECT c_id FROM user WHERE c_id = ?', [c_id]);
        if (existing.length === 0) return c_id;
    }
}

async function generateUniqueShippingId() {
    while (true) {
        const sh_id = generateNumericId(5);
        const existing = await query('SELECT sh_id FROM shipping_address WHERE sh_id = ?', [sh_id]);
        if (existing.length === 0) return sh_id;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {

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

        // Find tambon with full location details
        const tambonQuery = `
            SELECT 
                t.tambon_id,
                t.name_th as tambon_name,
                a.amphur_id,
                a.name_th as amphur_name,
                p.province_id,
                p.name_th as province_name,
                t.zip_code
            FROM tambons t
            JOIN amphurs a ON t.amphur_id = a.amphur_id
            JOIN provinces p ON a.province_id = p.province_id
            WHERE t.tambon_id = ?
        `;
        const [tambonDetails] = await query(tambonQuery, [tambon]);

        if (!tambonDetails) {
            return res.status(400).json({
                error: 'Invalid location',
                message: 'Location details not found'
            });
        }

        // Generate unique IDs
        const customerId = await generateUniqueCustomerId();
        const shippingId = await generateUniqueShippingId();

        // Create search term in Thai format
        const searchTerm = `ตำบล${tambonDetails.tambon_name} อำเภอ${tambonDetails.amphur_name} จังหวัด${tambonDetails.province_name}`;
        console.log('Searching address:', searchTerm);

        // Use the same shipping calculator as update-address
        const { coordinates } = await calculateShippingFee(searchTerm);
        console.log('Coordinates found:', coordinates);

        // Create shipping address with ALL details
        const shippingInsertQuery = `
            INSERT INTO shipping_address (
                sh_id, 
                tambon_id, 
                amphur_id,
                province_id,
                address, 
                latitude, 
                longitude,
                zip_code
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        const shippingValues = [
            shippingId,
            tambonDetails.tambon_id,
            tambonDetails.amphur_id,
            tambonDetails.province_id,
            address,
            coordinates?.lat || null,
            coordinates?.lng || null,
            postcode
        ];

        console.log('Shipping insert values:', shippingValues);

        await query(shippingInsertQuery, shippingValues);

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create customer record
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
        console.error('Registration error:', error);
        return res.status(500).json({
            error: 'Registration failed',
            message: process.env.NODE_ENV === 'development'
                ? `Registration failed: ${error.message}`
                : 'Registration failed. Please try again.'
        });
    }
}