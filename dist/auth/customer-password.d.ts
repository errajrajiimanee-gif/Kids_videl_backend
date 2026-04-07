export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(params: {
    password: string;
    storedHash: string;
}): Promise<boolean>;
