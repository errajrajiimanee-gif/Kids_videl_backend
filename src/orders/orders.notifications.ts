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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const getAdminDashboardUrl = () => {
  const raw = (process.env.ADMIN_DASHBOARD_URL || '').trim();
  if (raw) return raw;
  return 'https://kids-videl.vercel.app';
};

const formatPaymentLabel = (paymentMethod: Order['paymentMethod']) => {
  if (paymentMethod === 'card') return 'Carte bancaire (Blu)';
  return 'Paiement à la livraison';
};

const buildOrderText = (order: Order) => {
  const adminUrl = getAdminDashboardUrl();
  const adminOrderUrl = adminUrl ? `${adminUrl.replace(/\/$/, '')}/admin?orderId=${order.id}` : '';
  const lines = [
    `Nouvelle commande #${order.id}`,
    `Date: ${order.createdAt}`,
    `Paiement: ${formatPaymentLabel(order.paymentMethod)}`,
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

const buildOrderHtml = (order: Order) => {
  const adminUrl = getAdminDashboardUrl();
  const adminOrderUrl = adminUrl ? `${adminUrl.replace(/\/$/, '')}/admin?orderId=${order.id}` : '';
  const customerName = `${(order.customer.firstName || '').trim()} ${(order.customer.lastName || '').trim()}`.trim();
  const customerPhone = (order.customer.phone || '').trim();
  const customerEmail = (order.customer.email || '').trim();
  const customerAddress = [order.customer.address, order.customer.apartment, order.customer.city, order.customer.postalCode]
    .filter(Boolean)
    .map(v => String(v).trim())
    .filter(Boolean)
    .join(', ');

  const itemsRows = order.items
    .map((i) => {
      const lineTotal = i.price * i.quantity;
      return `
        <tr>
          <td style="padding:10px 12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;">${escapeHtml(i.name)}</td>
          <td style="padding:10px 12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;text-align:center;">${i.quantity}</td>
          <td style="padding:10px 12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;text-align:right;white-space:nowrap;">${escapeHtml(formatMoney(i.price))}</td>
          <td style="padding:10px 12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;text-align:right;white-space:nowrap;">${escapeHtml(formatMoney(lineTotal))}</td>
        </tr>
      `.trim();
    })
    .join('');

  const whatsappToCustomer =
    customerPhone ? `https://wa.me/${customerPhone.replace(/[^\d]/g, '')}` : '';

  return `
    <div style="background:#f6f7fb;padding:24px 0;">
      <div style="max-width:680px;margin:0 auto;padding:0 16px;">
        <div style="background:#ffffff;border:1px solid #eee;border-radius:16px;overflow:hidden;">
          <div style="padding:20px 22px;background:#111827;color:#fff;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:800;letter-spacing:0.3px;">Videl Kids</div>
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;opacity:0.9;margin-top:6px;">Nouvelle commande <span style="font-weight:800;">#${order.id}</span></div>
          </div>

          <div style="padding:20px 22px;">
            <div style="display:block;margin-bottom:14px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
              <div style="font-size:13px;color:#6b7280;">Date</div>
              <div style="font-size:14px;font-weight:700;">${escapeHtml(order.createdAt)}</div>
            </div>

            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin:10px 0 18px 0;">
              <tr>
                <td style="padding:12px 14px;background:#f9fafb;border:1px solid #eee;border-radius:12px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">Paiement</div>
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;color:#111827;">${escapeHtml(formatPaymentLabel(order.paymentMethod))}</div>
                </td>
                <td style="width:12px;"></td>
                <td style="padding:12px 14px;background:#f9fafb;border:1px solid #eee;border-radius:12px;">
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;">Livraison</div>
                  <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:800;color:#111827;">
                    ${escapeHtml(order.shippingMethod === 'casablanca' ? 'Casablanca' : 'Hors Casablanca')} (${escapeHtml(formatMoney(order.shippingCost))})
                  </div>
                </td>
              </tr>
            </table>

            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:900;color:#111827;margin:18px 0 10px 0;">Produits</div>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;border:1px solid #eee;border-radius:12px;overflow:hidden;">
              <thead>
                <tr style="background:#f9fafb;">
                  <th align="left" style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Produit</th>
                  <th align="center" style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Qté</th>
                  <th align="right" style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Prix</th>
                  <th align="right" style="padding:10px 12px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
                <tr>
                  <td colspan="3" style="padding:12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;font-weight:800;text-align:right;">Total commande</td>
                  <td style="padding:12px;border-top:1px solid #eee;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;font-weight:900;text-align:right;white-space:nowrap;">${escapeHtml(formatMoney(order.total))}</td>
                </tr>
              </tbody>
            </table>

            <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:900;color:#111827;margin:18px 0 10px 0;">Client</div>
            <div style="border:1px solid #eee;border-radius:12px;background:#ffffff;padding:14px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827;font-weight:800;">${escapeHtml(customerName || '—')}</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;margin-top:6px;">
                Téléphone: ${customerPhone ? `<a href="tel:${escapeHtml(customerPhone)}" style="color:#111827;text-decoration:underline;">${escapeHtml(customerPhone)}</a>` : '—'}
                ${whatsappToCustomer ? `&nbsp;&nbsp;•&nbsp;&nbsp;<a href="${escapeHtml(whatsappToCustomer)}" style="color:#16a34a;text-decoration:underline;">WhatsApp</a>` : ''}
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;margin-top:6px;">
                Email: ${customerEmail ? `<a href="mailto:${escapeHtml(customerEmail)}" style="color:#111827;text-decoration:underline;">${escapeHtml(customerEmail)}</a>` : '—'}
              </div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#374151;margin-top:6px;">
                Adresse: ${escapeHtml(customerAddress || '—')}
              </div>
            </div>

            <div style="margin-top:18px;">
              ${adminOrderUrl ? `
                <a href="${escapeHtml(adminOrderUrl)}" style="display:inline-block;background:#f97316;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-weight:900;font-size:14px;text-decoration:none;padding:12px 16px;border-radius:12px;">
                  Ouvrir dans l’admin
                </a>
              `.trim() : ''}
            </div>
          </div>
        </div>

        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9ca3af;margin-top:10px;text-align:center;">
          Cet email est généré automatiquement.
        </div>
      </div>
    </div>
  `.trim();
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
      : [process.env.ADMIN_WHATSAPP_NUMBER || '0666011062'];

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
  const html = buildOrderHtml(order);

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
      html,
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
