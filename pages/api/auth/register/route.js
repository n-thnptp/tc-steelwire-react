import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { hashPassword, generateSessionId } from '@/lib/auth';

export async function POST(request) {
    let connection;
    try {
        // Parse JSON body
        const body = await request.json();

        const {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            company,
            address,
            tambon_id
        } = body;

        connection = await getConnection();
        await connection.beginTransaction();

        // Check if email exists
        const [existingUsers] = await connection.execute(
            'SELECT c_id FROM customer WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            await connection.rollback();
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Create shipping address
        const [shippingResult] = await connection.execute(
            'INSERT INTO shipping_address (tambon_id, address) VALUES (?, ?)',
            [tambon_id, address]
        );
        const sh_id = shippingResult.insertId;

        // Hash password and create customer
        const hashedPassword = await hashPassword(password);
        const [customerResult] = await connection.execute(
            `INSERT INTO customer 
       (firstname, lastname, email, password_hashed, phone_number, company, sh_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, hashedPassword, phoneNumber, company, sh_id]
        );

        const c_id = customerResult.insertId;

        // Create session
        const sessionId = generateSessionId();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        await connection.execute(
            'INSERT INTO sessions (session_id, c_id, expiration) VALUES (?, ?, ?)',
            [sessionId, c_id, expirationDate]
        );

        await connection.commit();

        // Return JSON response
        return NextResponse.json({
            message: 'Registration successful',
            sessionId
        }, {
            status: 201,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}