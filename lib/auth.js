import argon2 from 'argon2';
import crypto from 'crypto';

export const generateSessionId = () => {
    return crypto.randomBytes(20).toString('hex');
};

export const validatePassword = async (plainPassword, hashedPassword) => {
    try {
        return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
        console.error('Error verifying password:', err);
        return false;
    }
};

export const hashPassword = async (password) => {
    try {
        return await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 65536,
            timeCost: 3,
            parallelism: 4,
            saltLength: 16
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Password hashing failed');
    }
};