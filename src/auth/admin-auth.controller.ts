import { Body, Controller, Post, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { createAdminToken } from './admin-token';

type AdminLoginBody = {
  username: string;
  password: string;
};

@Controller('auth/admin')
export class AdminAuthController {
  @Post('login')
  async login(@Body() body: AdminLoginBody): Promise<{ token: string; expiresAt: string }> {
    const username = (body?.username || '').trim();
    const password = (body?.password || '').trim();

    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_JWT_SECRET;
    const ttlSeconds = process.env.ADMIN_TOKEN_TTL_SECONDS ? Number(process.env.ADMIN_TOKEN_TTL_SECONDS) : 60 * 60 * 12;

    if (!envUser || !envPass || !secret) {
      throw new ServiceUnavailableException('Admin auth non configurée');
    }
    if (Number.isNaN(ttlSeconds) || ttlSeconds < 60) {
      throw new ServiceUnavailableException('Admin auth non configurée');
    }

    if (username !== envUser || password !== envPass) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    const token = createAdminToken({ subject: username, secret, ttlSeconds });
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    return { token, expiresAt };
  }
}

