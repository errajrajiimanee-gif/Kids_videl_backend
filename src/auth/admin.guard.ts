import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verifyAdminToken } from './admin-token';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const isProd = process.env.NODE_ENV === 'production';

    const apiKey = process.env.ADMIN_API_KEY;
    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!apiKey && !jwtSecret) {
      return isProd ? false : true;
    }

    const auth = request.headers['authorization'];
    if (jwtSecret && typeof auth === 'string') {
      const match = auth.match(/^Bearer\s+(.+)$/i);
      if (match && match[1]) {
        const payload = verifyAdminToken({ token: match[1], secret: jwtSecret });
        if (payload) return true;
      }
    }

    const providedKey = request.headers['x-admin-key'];
    if (apiKey && typeof providedKey === 'string' && providedKey === apiKey) return true;

    return false;
  }
}
