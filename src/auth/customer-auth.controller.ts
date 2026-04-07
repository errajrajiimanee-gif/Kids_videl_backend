import { BadRequestException, Body, Controller, Post, ServiceUnavailableException, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import * as https from 'https';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { hashPassword, verifyPassword } from './customer-password';
import { createCustomerToken } from './customer-token';
import { CustomerGuard } from './customer.guard';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { MailService } from './mail.service';

async function getGoogleUserInfo(accessToken: string): Promise<{ email: string; given_name?: string; family_name?: string; picture?: string }> {
  return new Promise((resolve, reject) => {
    https.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

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

const isEmailLike = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

@Controller('auth')
export class CustomerAuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly loyaltyService: LoyaltyService,
    private readonly mailService: MailService
  ) {}

  @Post('google-login')
  async googleLogin(@Body() body: { token: string }): Promise<{ token: string; expiresAt: string; user: { id: number; email: string; firstName?: string; lastName?: string } }> {
    const accessToken = body?.token;
    if (!accessToken) throw new BadRequestException('Token Google requis');

    try {
      const googleUser = await getGoogleUserInfo(accessToken);
      if (!googleUser.email) throw new UnauthorizedException('Email Google non trouvé');

      let user = await this.usersService.findByEmail(googleUser.email);
      
      if (!user) {
        // Create new user for Google login
        user = await this.usersService.create({
          createdAt: new Date().toISOString(),
          email: googleUser.email,
          passwordHash: '', // No password for Google users
          firstName: googleUser.given_name || undefined,
          lastName: googleUser.family_name || undefined,
        });

        // Auto-create loyalty profile
        await this.loyaltyService.create({
          firstName: googleUser.given_name || '',
          lastName: googleUser.family_name || '',
          email: googleUser.email,
          phone: '',
          points: 0
        });
      }

      const secret = process.env.CUSTOMER_JWT_SECRET;
      const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
      
      if (!secret) throw new ServiceUnavailableException('Auth client non configurée');

      const token = createCustomerToken({ userId: user.id, email: user.email, secret, ttlSeconds });
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
      
      return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
    } catch (err) {
      console.error('Google verification error:', err);
      throw new UnauthorizedException('Validation Google échouée');
    }
  }

  @Post('register')
  async register(@Body() body: RegisterBody): Promise<{ token: string; expiresAt: string; user: { id: number; email: string; firstName?: string; lastName?: string } }> {
    const email = (body?.email || '').trim().toLowerCase();
    const password = (body?.password || '').trim();
    const firstName = (body?.firstName || '').trim();
    const lastName = (body?.lastName || '').trim();

    if (!email || !isEmailLike(email)) throw new BadRequestException('Email invalide');
    if (password.length < 8) throw new BadRequestException('Mot de passe trop court');

    const existing = await this.usersService.findByEmail(email);
    if (existing) throw new BadRequestException('Email déjà utilisé');

    const secret = process.env.CUSTOMER_JWT_SECRET;
    const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
    if (!secret) throw new ServiceUnavailableException('Auth client non configurée');
    if (Number.isNaN(ttlSeconds) || ttlSeconds < 60) throw new ServiceUnavailableException('Auth client non configurée');

    const passwordHash = await hashPassword(password);
    const user = await this.usersService.create({
      createdAt: new Date().toISOString(),
      email,
      passwordHash,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });

    // Auto-create loyalty profile on registration
    await this.loyaltyService.create({
      firstName: firstName || '',
      lastName: lastName || '',
      email,
      phone: '', // Can be updated later
      points: 0
    });

    const token = createCustomerToken({ userId: user.id, email: user.email, secret, ttlSeconds });
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }

  @Post('login')
  async login(@Body() body: LoginBody): Promise<{ token: string; expiresAt: string; user: { id: number; email: string; firstName?: string; lastName?: string } }> {
    const email = (body?.email || '').trim().toLowerCase();
    const password = (body?.password || '').trim();
    if (!email || !isEmailLike(email)) throw new BadRequestException('Email invalide');
    if (!password) throw new BadRequestException('Mot de passe requis');

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const ok = await verifyPassword({ password, storedHash: user.passwordHash });
    if (!ok) throw new UnauthorizedException('Identifiants invalides');

    const secret = process.env.CUSTOMER_JWT_SECRET;
    const ttlSeconds = process.env.CUSTOMER_TOKEN_TTL_SECONDS ? Number(process.env.CUSTOMER_TOKEN_TTL_SECONDS) : 60 * 60 * 24 * 7;
    if (!secret) throw new ServiceUnavailableException('Auth client non configurée');
    if (Number.isNaN(ttlSeconds) || ttlSeconds < 60) throw new ServiceUnavailableException('Auth client non configurée');

    const token = createCustomerToken({ userId: user.id, email: user.email, secret, ttlSeconds });
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
    return { token, expiresAt, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } };
  }

  @Get('me')
  @UseGuards(CustomerGuard)
  async me(@Req() request: any): Promise<{ id: number; email: string; firstName?: string; lastName?: string; phone?: string; points?: number }> {
    const uid = request?.user?.uid;
    if (typeof uid !== 'number') throw new UnauthorizedException('Non autorisé');
    const user = await this.usersService.findById(uid);
    if (!user) throw new UnauthorizedException('Non autorisé');
    
    // Loyalty check
    const loyaltyMember = await this.loyaltyService.findByEmailOrPhone(user.email, user.phone || '');
    
    return { 
      id: user.id, 
      email: user.email, 
      firstName: user.firstName, 
      lastName: user.lastName,
      phone: user.phone,
      points: loyaltyMember?.points || 0
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }): Promise<{ message: string }> {
    const email = (body?.email || '').trim().toLowerCase();
    if (!email || !isEmailLike(email)) throw new BadRequestException('Email invalide');
    
    const user = await this.usersService.findByEmail(email);
    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 1); // 1 hour expiration
      
      await this.usersService.update(user.id, {
        resetToken: token,
        resetTokenExpires: expires.toISOString()
      });
      
      const baseUrl = process.env.ADMIN_DASHBOARD_URL || 'http://localhost:5173';
      const resetLink = `${baseUrl.replace(/\/$/, '')}/reset-password?token=${token}`;
      
      await this.mailService.sendResetPasswordEmail(email, resetLink);
    }
    
    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; password: string }): Promise<{ message: string }> {
    const { token, password } = body;
    if (!token || !password) throw new BadRequestException('Données manquantes');
    if (password.length < 8) throw new BadRequestException('Mot de passe trop court');

    const user = await this.usersService.findByResetToken(token);
    if (!user) throw new BadRequestException('Token invalide');

    if (user.resetTokenExpires && new Date(user.resetTokenExpires) < new Date()) {
      throw new BadRequestException('Token expiré');
    }

    const passwordHash = await hashPassword(password);
    await this.usersService.update(user.id, {
      passwordHash,
      resetToken: undefined,
      resetTokenExpires: undefined
    });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }
}
