"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerToken = createCustomerToken;
exports.verifyCustomerToken = verifyCustomerToken;
const crypto = require("crypto");
const base64UrlEncode = (value) => Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
const base64UrlDecode = (value) => {
    const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + pad, 'base64').toString('utf8');
};
const safeEqual = (a, b) => {
    const ab = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ab.length !== bb.length)
        return false;
    return crypto.timingSafeEqual(ab, bb);
};
function createCustomerToken(params) {
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        sub: params.email,
        uid: params.userId,
        iat: now,
        exp: now + params.ttlSeconds,
    };
    const body = base64UrlEncode(JSON.stringify(payload));
    const sig = crypto.createHmac('sha256', params.secret).update(body).digest('base64');
    const sigUrl = sig.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `${body}.${sigUrl}`;
}
function verifyCustomerToken(params) {
    const parts = params.token.split('.');
    if (parts.length !== 2)
        return null;
    const [body, sigUrl] = parts;
    if (!body || !sigUrl)
        return null;
    const expectedSig = crypto.createHmac('sha256', params.secret).update(body).digest('base64');
    const expectedSigUrl = expectedSig.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    if (!safeEqual(expectedSigUrl, sigUrl))
        return null;
    let payload;
    try {
        payload = JSON.parse(base64UrlDecode(body));
    }
    catch {
        return null;
    }
    if (!payload || typeof payload.sub !== 'string' || typeof payload.uid !== 'number' || typeof payload.iat !== 'number' || typeof payload.exp !== 'number')
        return null;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp <= now)
        return null;
    return payload;
}
//# sourceMappingURL=customer-token.js.map