"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
let MailService = MailService_1 = class MailService {
    constructor() {
        this.logger = new common_1.Logger(MailService_1.name);
        const smtpHost = process.env.SMTP_HOST;
        const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        if (smtpHost && smtpUser && smtpPass) {
            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: smtpPort,
                secure: smtpPort === 465,
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });
            this.logger.log(`SMTP configured for ${smtpHost}:${smtpPort}`);
        }
        else {
            this.logger.warn('SMTP not configured. Reset password emails will only be logged to console.');
        }
    }
    async sendResetPasswordEmail(to, resetLink) {
        const smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
        try {
            if (!this.transporter)
                throw new Error('No transporter');
            const info = await this.transporter.sendMail({
                from: `"Videl Kids" <${smtpFrom}>`,
                to,
                subject: 'Réinitialisation de votre mot de passe - Videl Kids',
                html: this.getHtmlTemplate(resetLink),
                text: `Bonjour, Vous avez demandé la réinitialisation de votre mot de passe. Veuillez utiliser le lien suivant : ${resetLink}. Ce lien est valable pendant 1 heure.`,
            });
            this.logger.log(`Reset password email sent to ${to}: ${info.messageId}`);
            return true;
        }
        catch (error) {
            if (error.message.includes('535-5.7.8')) {
                this.logger.error('---------------------------------------------------------');
                this.logger.error('ERREUR GMAIL : CONNEXION REFUSÉE');
                this.logger.error(`Utilisateur : ${process.env.SMTP_USER}`);
                this.logger.error(`Mot de passe utilisé : ${process.env.SMTP_PASS}`);
                this.logger.error('RAISON : Google bloque la connexion car le mot de passe est incorrect.');
                this.logger.error('SOLUTION : Vous devez créer un "Mot de passe d\'application" sur votre compte Google.');
                this.logger.error('LIEN : https://myaccount.google.com/apppasswords');
                this.logger.error('---------------------------------------------------------');
            }
            else {
                this.logger.error(`Failed to send reset password email via SMTP to ${to}:`, error);
            }
            try {
                const testAccount = await nodemailer.createTestAccount();
                const testTransporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: { user: testAccount.user, pass: testAccount.pass },
                });
                const info = await testTransporter.sendMail({
                    from: `"Videl Kids (Test)" <no-reply@videlkids.ma>`,
                    to,
                    subject: 'Réinitialisation de votre mot de passe (TEST) - Videl Kids',
                    html: this.getHtmlTemplate(resetLink),
                    text: `Bonjour, Vous avez demandé la réinitialisation de votre mot de passe. Veuillez utiliser le lien suivant : ${resetLink}. Ce lien est valable pendant 1 heure.`,
                });
                const previewUrl = nodemailer.getTestMessageUrl(info);
                this.logger.warn(`FALLBACK: Email envoyé via Ethereal. Voir l'aperçu ici : ${previewUrl}`);
                return true;
            }
            catch (fallbackError) {
                this.logger.error(`Fallback failed: ${resetLink}`);
                return false;
            }
        }
    }
    getHtmlTemplate(resetLink) {
        return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4CAF50;">Videl Kids</h1>
        </div>
        <p>Bonjour,</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe pour votre compte Videl Kids.</p>
        <p>Veuillez cliquer sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable pendant 1 heure.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Réinitialiser mon mot de passe</a>
        </div>
        <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2024 Videl Kids. Tous droits réservés.</p>
      </div>
    `;
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map