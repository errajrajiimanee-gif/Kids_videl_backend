import { UsersService } from '../users/users.service';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { MailService } from './mail.service';
type RegisterBody = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
};
type LoginBody = {
    email: string;
    password: string;
};
export declare class CustomerAuthController {
    private readonly usersService;
    private readonly loyaltyService;
    private readonly mailService;
    constructor(usersService: UsersService, loyaltyService: LoyaltyService, mailService: MailService);
    googleLogin(body: {
        token: string;
    }): Promise<{
        token: string;
        expiresAt: string;
        user: {
            id: number;
            email: string;
            firstName?: string;
            lastName?: string;
        };
    }>;
    register(body: RegisterBody): Promise<{
        token: string;
        expiresAt: string;
        user: {
            id: number;
            email: string;
            firstName?: string;
            lastName?: string;
        };
    }>;
    login(body: LoginBody): Promise<{
        token: string;
        expiresAt: string;
        user: {
            id: number;
            email: string;
            firstName?: string;
            lastName?: string;
        };
    }>;
    me(request: any): Promise<{
        id: number;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        points?: number;
    }>;
    forgotPassword(body: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        message: string;
    }>;
}
export {};
