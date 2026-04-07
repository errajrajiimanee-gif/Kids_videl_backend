type AdminLoginBody = {
    username: string;
    password: string;
};
export declare class AdminAuthController {
    login(body: AdminLoginBody): Promise<{
        token: string;
        expiresAt: string;
    }>;
}
export {};
