import * as crypto from 'crypto';

type CustomerTokenPayload = {
  sub: string;
  iat: number;
  exp: number;
  uid: number;
};

const base64UrlEncode = (value: string) =>
  Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const base64UrlDecode = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64').toString('utf8');
};

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
};

export function createCustomerToken(params: { userId: number; email: string; secret: string; ttlSeconds: number }): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: CustomerTokenPayload = {
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

export function verifyCustomerToken(params: { token: string; secret: string }): CustomerTokenPayload | null {
  const parts = params.token.split('.');
  if (parts.length !== 2) return null;
  const [body, sigUrl] = parts;
  if (!body || !sigUrl) return null;

  const expectedSig = crypto.createHmac('sha256', params.secret).update(body).digest('base64');
  const expectedSigUrl = expectedSig.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  if (!safeEqual(expectedSigUrl, sigUrl)) return null;

  let payload: CustomerTokenPayload;
  try {
    payload = JSON.parse(base64UrlDecode(body)) as CustomerTokenPayload;
  } catch {
    return null;
  }

  if (!payload || typeof payload.sub !== 'string' || typeof payload.uid !== 'number' || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) return null;
  return payload;
}

