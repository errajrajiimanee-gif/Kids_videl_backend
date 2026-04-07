type AdminTokenPayload = {
    sub: string;
    iat: number;
    exp: number;
};
export declare function createAdminToken(params: {
    subject: string;
    secret: string;
    ttlSeconds: number;
}): string;
export declare function verifyAdminToken(params: {
    token: string;
    secret: string;
}): AdminTokenPayload | null;
export {};
