import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { verifyPassword, generateSessionId } from '@/lib/auth';

export async function POST(request) {
    let connection;
    try {
        const body = await request.json();
        const { email, password } = body;

        connection = await getConnection();

        // Get customer with shipping address
        const [customers] = await connection.execute(
            `SELECT c.*, sh.address, sh.tambon_id,
              t.name_th as tambon_name, t.zip_code,
              a.name_th as amphur_name,
              p.name_th as province_name
       FROM customer c
       LEFT JOIN shipping_address sh ON c.sh_id = sh.sh_id
       LEFT JOIN tambons t ON sh.tambon_id = t.id
       LEFT JOIN amphurs a ON t.amphur_id = a.amphur_id
       LEFT JOIN provinces p ON a.province_id = p.province_id
       WHERE c.email = ?`,
            [email]
        );

        if (customers.length === 0) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const customer = customers[0];

        // Verify password
        const isValid = await verifyPassword(customer.password_hashed, password);
        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create new session
        const sessionId = generateSessionId();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        await connection.execute(
            'INSERT INTO sessions (session_id, c_id, expiration) VALUES (?, ?, ?)',
            [sessionId, customer.c_id, expirationDate]
        );

        // Remove password from response
        delete customer.password_hashed;

        return NextResponse.json({
            message: 'Login successful',
            sessionId,
            customer
        }, {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
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

// Add an OPTIONS handler for CORS
export async function OPTIONS(request) {
    return NextResponse.json({}, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}