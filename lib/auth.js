import * as argon2 from 'argon2';
import crypto from 'crypto';

export async function hashPassword(password) {
    return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
        saltLength: 16
    });
}

export async function verifyPassword(hashedPassword, password) {
    return await argon2.verify(hashedPassword, password);
}

export function generateSessionId() {
    return crypto.randomBytes(20).toString('hex');
}