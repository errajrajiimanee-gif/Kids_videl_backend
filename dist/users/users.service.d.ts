import { User } from './user.interface';
export declare class UsersService {
    private store;
    findByEmail(email: string): Promise<User | undefined>;
    findById(id: number): Promise<User | undefined>;
    create(user: Omit<User, 'id'>): Promise<User>;
    update(id: number, user: Partial<User>): Promise<User | null>;
    findByResetToken(token: string): Promise<User | undefined>;
}
