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

const normalizeWhatsApp = (value: string) => {
  const raw = value.replace(/[^\d+]/g, '');
  if (raw.startsWith('+')) return raw;
  if (raw.startsWith('0') && raw.length === 10) return `+212${raw.slice(1)}`;
  if (raw.startsWith('212')) return `+${raw}`;
  return raw.startsWith('+') ? raw : `+${raw}`;
};

const buildWhatsAppLink = (phoneE164: string, text: string) => {
  const digits = phoneE164.replace(/[^\d]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const buildMailTo = (email: string, subject: string, body: string) =>
  `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const formatMoney = (value: number) => `${value.toFixed(2)} MAD`;

const parseList = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);
};

const unique = (values: string[]) => Array.from(new Set(values.map(v => v.trim()).filter(Boolean)));

const buildOrderText = (order: Order) => {
  const adminUrl = (process.env.ADMIN_DASHBOARD_URL || '').trim();
  const adminOrderUrl = adminUrl ? `${adminUrl.replace(/\/$/, '')}/admin?orderId=${order.id}` : '';
  const lines = [
    `Nouvelle commande #${order.id}`,
    `Date: ${order.createdAt}`,
    `Paiement: Paiement à la livraison`,
    `Livraison: ${order.shippingMethod === 'casablanca' ? 'Casablanca' : 'Hors Casablanca'} (${formatMoney(order.shippingCost)})`,
    `Total: ${formatMoney(order.total)}`,
    adminOrderUrl ? `Admin: ${adminOrderUrl}` : '',
    '',
    'Client:',
    `Nom: ${(order.customer.firstName || '').trim()} ${(order.customer.lastName || '').trim()}`.trim(),
    `Téléphone: ${order.customer.phone || ''}`.trim(),
    `Email: ${order.customer.email || ''}`.trim(),
    `Adresse: ${[order.customer.address, order.customer.apartment, order.customer.city, order.customer.postalCode].filter(Boolean).join(', ')}`,
    '',
    'Produits:',
    ...order.items.map(i => `- ${i.name} x${i.quantity} (${formatMoney(i.price)})`),
  ].filter(Boolean);

  return lines.join('\n');
};

export function buildNotifyPreview(order: Order): Omit<NotifyResult, 'email' | 'whatsapp'> {
  const emailsFromLists = unique([
    ...parseList(process.env.ADMIN_NOTIFY_EMAILS),
    ...parseList(process.env.SUPPORT_NOTIFY_EMAILS),
  ]);
  const fallbackEmail =
    (process.env.ADMIN_NOTIFY_EMAIL || '').trim() ||
    (process.env.SUPPORT_NOTIFY_EMAIL || '').trim() ||
    'support@example.com';
  const emails = emailsFromLists.length > 0 ? emailsFromLists : [fallbackEmail];

  const whatsappsRaw =
    parseList(process.env.ADMIN_WHATSAPP_NUMBERS).length > 0
      ? parseList(process.env.ADMIN_WHATSAPP_NUMBERS)
      : [process.env.ADMIN_WHATSAPP_NUMBER || '0668349565'];

  const subject = `Nouvelle commande #${order.id}`;
  const text = buildOrderText(order);

  const adminWhatsApps = whatsappsRaw.map(normalizeWhatsApp);
  const whatsappLinks = adminWhatsApps.map(phone => buildWhatsAppLink(phone, text));
  const mailTos = emails.map(email => buildMailTo(email, subject, text));

  const adminEmail = emails[0];
  const adminWhatsApp = whatsappsRaw[0];
  const whatsappLink = whatsappLinks[0] || buildWhatsAppLink(normalizeWhatsApp(adminWhatsApp), text);
  const mailTo = mailTos[0] || buildMailTo(adminEmail, subject, text);

  return { mailTo, whatsappLink, adminEmail, adminWhatsApp, adminEmails: emails, adminWhatsApps, mailTos, whatsappLinks };
}

export async function notifyAdmin(order: Order): Promise<NotifyResult> {
  const preview = buildNotifyPreview(order);
  const subject = `Nouvelle commande #${order.id}`;
  const text = buildOrderText(order);

  let emailSent = false;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
    const nodemailer = require('nodemailer') as typeof import('nodemailer');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: preview.adminEmails,
      subject,
      text,
    });
    emailSent = true;
  }

  let whatsappSent = false;
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_WHATSAPP_FROM;

  if (twilioSid && twilioToken && twilioFrom) {
    const results = await Promise.all(
      preview.adminWhatsApps.map(async (phoneE164) => {
        const body = new URLSearchParams();
        body.set('From', `whatsapp:${twilioFrom}`);
        body.set('To', `whatsapp:${phoneE164}`);
        body.set('Body', text);

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        return res.ok;
      })
    );
    whatsappSent = results.every(Boolean);
  }

  return { email: emailSent, whatsapp: whatsappSent, ...preview };
}
