import nodemailer from 'nodemailer';
import { SmtpConfig, CapturedLead, VenueSettings } from './storage';

export async function sendLeadNotificationEmail(
  venue: VenueSettings,
  lead: CapturedLead
): Promise<{ success: boolean; message: string }> {
  const smtp = venue.smtp;

  if (!smtp || !smtp.enabled) {
    return {
      success: false,
      message: 'SMTP email notifications are currently disabled for this venue.'
    };
  }

  if (!smtp.host || !smtp.user || !smtp.pass || !smtp.notifyEmail) {
    return {
      success: false,
      message: 'Incomplete SMTP server configuration. Please specify Host, Username, Password and Notification Email.'
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.secure || false,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"${smtp.fromName || venue.name}" <${smtp.fromEmail || smtp.user}>`,
      to: smtp.notifyEmail,
      subject: `🎉 New Wi-Fi Lead Captured: ${lead.name} (${venue.name})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #22c55e; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin: 0;">🎉 New Wi-Fi Lead Captured!</h2>
            <p style="color: #6b7280; font-size: 14px; margin-top: 4px;">Venue: <strong>${venue.name}</strong></p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold; width: 35%;">Guest Name:</td>
              <td style="padding: 10px 0; color: #111827; font-size: 16px;">${lead.name}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Contact Info:</td>
              <td style="padding: 10px 0; color: #16a34a; font-weight: bold; font-size: 16px;">${lead.emailOrPhone}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Interests:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.interests.join(', ') || 'General Wi-Fi'}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Marketing Consent:</td>
              <td style="padding: 10px 0; color: #111827;">${lead.marketingConsent ? '✅ Yes (Opted In)' : '❌ No'}</td>
            </tr>
            <tr style="border-top: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Device / Time:</td>
              <td style="padding: 10px 0; color: #6b7280; font-size: 13px;">${lead.deviceType || 'Mobile Browser'} • ${new Date(lead.createdAt).toLocaleString()}</td>
            </tr>
          </table>

          <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; color: #15803d; font-size: 14px;">
              💡 <strong>Pro Tip:</strong> Export your full leads list anytime from your <a href="#" style="color: #16a34a; text-decoration: underline;">Explore Local Wi-Fi Dashboard</a>.
            </p>
          </div>

          <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            Sent automatically by Explore Local QR Wi-Fi Lead Capture System
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully via custom SMTP.' };
  } catch (error: any) {
    console.error('Failed to send SMTP email notification:', error);
    return {
      success: false,
      message: error?.message || 'SMTP Connection error. Please verify host and credentials.'
    };
  }
}

export async function testSmtpConnection(
  smtp: SmtpConfig
): Promise<{ success: boolean; message: string }> {
  if (!smtp.host || !smtp.user || !smtp.pass) {
    return { success: false, message: 'Missing required SMTP Host, Username or Password.' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 587,
      secure: smtp.secure || false,
      auth: {
        user: smtp.user,
        pass: smtp.pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();

    if (smtp.notifyEmail) {
      await transporter.sendMail({
        from: `"${smtp.fromName || 'QR Wi-Fi System'}" <${smtp.fromEmail || smtp.user}>`,
        to: smtp.notifyEmail,
        subject: '✅ Explore Local Wi-Fi - SMTP Test Email Successful!',
        text: 'Your custom outgoing email server (SMTP) setup is working correctly! You will receive real-time email alerts whenever guests scan your QR code and connect to your Wi-Fi.'
      });
    }

    return { success: true, message: 'SMTP connection verified successfully! Test email dispatched.' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to SMTP server.' };
  }
}
