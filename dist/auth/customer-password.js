"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const crypto = require("crypto");
const scryptAsync = (password, salt, keylen) => new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
        if (err)
            return reject(err);
        resolve(derivedKey);
    });
});
const safeEqual = (a, b) => {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length)
        return false;
    return crypto.timingSafeEqual(ab, bb);
};
async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const derived = await scryptAsync(password, salt, 64);
    const payload = {
        algo: 'scrypt',
        saltBase64: salt.toString('base64'),
        hashBase64: derived.toString('base64'),
    };
    return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
}
async function verifyPassword(params) {
    let decoded;
    try {
        const raw = Buffer.from(params.storedHash, 'base64').toString('utf8');
        decoded = JSON.parse(raw);
    }
    catch {
        return false;
    }
    if (!decoded || decoded.algo !== 'scrypt' || !decoded.saltBase64 || !decoded.hashBase64)
        return false;
    const salt = Buffer.from(decoded.saltBase64, 'base64');
    const derived = await scryptAsync(params.password, salt, 64);
    const hashBase64 = derived.toString('base64');
    return safeEqual(hashBase64, decoded.hashBase64);
}
//# sourceMappingURL=customer-password.js.map