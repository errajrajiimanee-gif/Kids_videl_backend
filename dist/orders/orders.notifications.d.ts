import type { Order } from './order.interface';
export type NotifyResult = {
    email: boolean;
    whatsapp: boolean;
    mailTo: string;
    whatsappLink: string;
    adminEmail: string;
    adminWhatsApp: string;
    adminEmails: string[];
    adminWhatsApps: string[];
    mailTos: string[];
    whatsappLinks: string[];
};
export declare function buildNotifyPreview(order: Order): Omit<NotifyResult, 'email' | 'whatsapp'>;
export declare function notifyAdmin(order: Order): Promise<NotifyResult>;
