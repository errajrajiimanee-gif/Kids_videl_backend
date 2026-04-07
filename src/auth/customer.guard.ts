import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyCustomerToken } from './customer-token';

@Injectable()
export class CustomerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const secret = process.env.CUSTOMER_JWT_SECRET;
    if (!secret) return process.env.NODE_ENV === 'production' ? false : true;

    const request = context.switchToHttp().getRequest();
    const auth = request.headers['authorization'];
    if (typeof auth !== 'string') return false;
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (!match || !match[1]) return false;

    const payload = verifyCustomerToken({ token: match[1], secret });
    if (!payload) return false;
    request.user = payload;
    return true;
  }
}

