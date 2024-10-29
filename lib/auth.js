import * as argon2 from 'argon2';
import crypto from 'crypto';

export const generateSessionId = () => {
    return crypto.randomBytes(20).toString('hex');
};

export const validatePassword = async (plainPassword, hashedPassword) => {
    try {
        // $argon2id$v=19$m=65536,t=2,p=4$0Hn5dVc89cFN72GTPe2
        // $argon2id$v=19$m=65536,t=2,p=4$0Hn5dVc89cFN72GTPe2

        const verify = await argon2.verify(hashedPassword, plainPassword);
        return verify;
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
            timeCost: 2,
            parallelism: 4,
            saltLength: 16,
            hashLength: 50
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        throw new Error('Password hashing failed');
    }
};