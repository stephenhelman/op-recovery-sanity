export function buildNotificationEmail({
  companyName,
  colors,
  fields,
  submittedAt,
}: {
  companyName: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  fields: { label: string; value: string }[];
  submittedAt: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${colors.primary};padding:24px 32px;">
            <h1 style="margin:0;color:${colors.background};font-size:20px;">
              ${companyName}
            </h1>
            <p style="margin:4px 0 0;color:${colors.accent};font-size:14px;">
              New Form Submission
            </p>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:8px;overflow:hidden;">

              <tr>
                <td style="padding:24px 32px;border-bottom:2px solid ${colors.accent};">
                  <h2 style="margin:0;color:${colors.primary};font-size:18px;">
                    New Inquiry Received
                  </h2>
                  <p style="margin:4px 0 0;color:#666;font-size:13px;">
                    ${submittedAt}
                  </p>
                </td>
              </tr>

              ${fields.map(f => `
              <tr>
                <td style="padding:16px 32px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0;color:#999;font-size:12px;
                    text-transform:uppercase;letter-spacing:0.5px;">
                    ${f.label}
                  </p>
                  <p style="margin:4px 0 0;color:${colors.text};font-size:15px;">
                    ${f.value || '—'}
                  </p>
                </td>
              </tr>
              `).join('')}

            </table>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${colors.primary};padding:16px 32px;text-align:center;">
            <p style="margin:0;color:${colors.background};font-size:12px;opacity:0.7;">
              This notification was sent by ${companyName}'s website contact form.
            </p>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}

export function buildConfirmationEmail({
  companyName,
  colors,
  recipientName,
  successMessage,
  fields,
}: {
  companyName: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  recipientName: string;
  successMessage: string;
  fields: { label: string; value: string }[];
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${colors.primary};padding:24px 32px;">
            <h1 style="margin:0;color:${colors.background};font-size:20px;">
              ${companyName}
            </h1>
          </td>
        </tr>
      </table>

      <!-- Body -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:32px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#ffffff;border-radius:8px;overflow:hidden;">

              <tr>
                <td style="padding:32px;border-bottom:2px solid ${colors.accent};">
                  <h2 style="margin:0;color:${colors.primary};font-size:22px;">
                    Thank you, ${recipientName}!
                  </h2>
                  <p style="margin:12px 0 0;color:${colors.text};font-size:15px;
                    line-height:1.6;">
                    ${successMessage}
                  </p>
                </td>
              </tr>

              <tr>
                <td style="padding:24px 32px 8px;">
                  <p style="margin:0;color:#999;font-size:13px;
                    text-transform:uppercase;letter-spacing:0.5px;">
                    Your Submission Summary
                  </p>
                </td>
              </tr>

              ${fields.map(f => `
              <tr>
                <td style="padding:8px 32px;border-bottom:1px solid #f0f0f0;">
                  <p style="margin:0;color:#999;font-size:12px;">
                    ${f.label}
                  </p>
                  <p style="margin:2px 0 0;color:${colors.text};font-size:14px;">
                    ${f.value || '—'}
                  </p>
                </td>
              </tr>
              `).join('')}

              <tr>
                <td style="padding:24px 32px;">
                  <p style="margin:0;color:#666;font-size:13px;">
                    If you have any questions, please don't hesitate to reach out.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:${colors.primary};padding:16px 32px;text-align:center;">
            <p style="margin:0;color:${colors.background};font-size:12px;opacity:0.7;">
              © ${new Date().getFullYear()} ${companyName}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}
