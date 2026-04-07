export declare class MailService {
    private readonly logger;
    private transporter;
    constructor();
    sendResetPasswordEmail(to: string, resetLink: string): Promise<boolean>;
    private getHtmlTemplate;
}
