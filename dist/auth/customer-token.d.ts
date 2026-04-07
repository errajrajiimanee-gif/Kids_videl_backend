type CustomerTokenPayload = {
    sub: string;
    iat: number;
    exp: number;
    uid: number;
};
export declare function createCustomerToken(params: {
    userId: number;
    email: string;
    secret: string;
    ttlSeconds: number;
}): string;
export declare function verifyCustomerToken(params: {
    token: string;
    secret: string;
}): CustomerTokenPayload | null;
export {};
