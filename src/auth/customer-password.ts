import * as crypto from 'crypto';

type PasswordHash = {
  algo: 'scrypt';
  saltBase64: string;
  hashBase64: string;
};

const scryptAsync = (password: string, salt: Buffer, keylen: number) =>
  new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey as Buffer);
    });
  });

const safeEqual = (a: string, b: string) => {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
};

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  const derived = await scryptAsync(password, salt, 64);
  const payload: PasswordHash = {
    algo: 'scrypt',
    saltBase64: salt.toString('base64'),
    hashBase64: derived.toString('base64'),
  };
  return Buffer.from(JSON.stringify(payload), 'utf8').toString('base64');
}

export async function verifyPassword(params: { password: string; storedHash: string }): Promise<boolean> {
  let decoded: PasswordHash;
  try {
    const raw = Buffer.from(params.storedHash, 'base64').toString('utf8');
    decoded = JSON.parse(raw) as PasswordHash;
  } catch {
    return false;
  }

  if (!decoded || decoded.algo !== 'scrypt' || !decoded.saltBase64 || !decoded.hashBase64) return false;

  const salt = Buffer.from(decoded.saltBase64, 'base64');
  const derived = await scryptAsync(params.password, salt, 64);
  const hashBase64 = derived.toString('base64');
  return safeEqual(hashBase64, decoded.hashBase64);
}

