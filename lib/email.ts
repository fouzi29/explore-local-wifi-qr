import nodemailer from 'nodemailer';
import { SmtpConfig, CapturedLead, VenueSettings } from './storage';

const MASTER_CREATOR_EMAIL = 'fouzi.cse@gmail.com';
const MASTER_CREATOR_PASS = 'fzfemass@21@(fzm)@g1#f1';

// Default system transporter using creator credentials
function getMasterTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: MASTER_CREATOR_EMAIL,
      pass: MASTER_CREATOR_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * 1. Sends lead notification to the VENUE OWNER when a guest scans and submits details.
 */
export async function sendVenueLeadEmail(
  venue: VenueSettings,
  lead: CapturedLead
): Promise<{ success: boolean; message: string }> {
  const recipientEmail = venue.smtp?.notifyEmail || venue.smtp?.fromEmail || venue.smtp?.user || MASTER_CREATOR_EMAIL;
  
  // Use venue custom SMTP if enabled, otherwise use system mailer
  const transporter = (venue.smtp && venue.smtp.enabled && venue.smtp.host && venue.smtp.user && venue.smtp.pass)
    ? nodemailer.createTransport({
        host: venue.smtp.host,
        port: venue.smtp.port || 587,
        secure: venue.smtp.secure || false,
        auth: {
          user: venue.smtp.user,
          pass: venue.smtp.pass
        },
        tls: { rejectUnauthorized: false }
      })
    : getMasterTransporter();

  try {
    const mailOptions = {
      from: `"Explore Local Wi-Fi" <${venue.smtp?.fromEmail || MASTER_CREATOR_EMAIL}>`,
      to: recipientEmail,
      subject: `🎉 New Wi-Fi Lead Captured: ${lead.name} (${venue.name})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #22c55e; padding-bottom: 16px; margin-bottom: 20px;">
            <h2 style="color: #111827; margin: 0;">🎉 New Guest Wi-Fi Lead Captured!</h2>
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
              <td style="padding: 10px 0; color: #4b5563; font-weight: bold;">Device & Time:</td>
              <td style="padding: 10px 0; color: #6b7280; font-size: 13px;">${lead.deviceType || 'Mobile'} • ${new Date(lead.createdAt).toLocaleString()}</td>
            </tr>
          </table>

          <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 6px; margin-bottom: 24px;">
            <p style="margin: 0; color: #15803d; font-size: 14px;">
              💡 View and export all your venue leads anytime from your dashboard.
            </p>
          </div>

          <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            Sent automatically by Explore Local QR Wi-Fi Lead Capture SaaS
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: `Email sent to venue owner (${recipientEmail}).` };
  } catch (error: any) {
    console.error('Failed to send venue lead email:', error);
    return { success: false, message: error?.message || 'SMTP Connection error.' };
  }
}

/**
 * 2. Sends notification to PLATFORM CREATOR (fouzi.cse@gmail.com) whenever someone creates a new venue portal!
 */
export async function sendCreatorVenueAlertEmail(
  venue: VenueSettings
): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getMasterTransporter();
    await transporter.sendMail({
      from: `"Explore Local SaaS System" <${MASTER_CREATOR_EMAIL}>`,
      to: MASTER_CREATOR_EMAIL,
      subject: `🚨 New System User Registered: ${venue.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          <h2 style="color: #0d9488; margin-top: 0;">🚨 New Venue Created On Your SaaS System!</h2>
          <p>A new restaurant/venue owner has created a portal on your platform without developer touch.</p>
          <ul style="line-height: 1.8; color: #374151;">
            <li><strong>Venue Name:</strong> ${venue.name}</li>
            <li><strong>Slug URL:</strong> /v/${venue.slug}</li>
            <li><strong>Wi-Fi SSID:</strong> ${venue.wifi.ssid}</li>
            <li><strong>Owner Contact Email:</strong> ${venue.smtp?.notifyEmail || venue.smtp?.user || 'Not specified'}</li>
            <li><strong>Created At:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">Sent to Platform Creator: ${MASTER_CREATOR_EMAIL}</p>
        </div>
      `
    });
    return { success: true, message: 'Creator alert sent to fouzi.cse@gmail.com' };
  } catch (err: any) {
    console.error('Failed to send creator venue alert:', err);
    return { success: false, message: err?.message || 'Failed creator alert' };
  }
}

/**
 * 3. Sends notification to PLATFORM CREATOR (fouzi.cse@gmail.com) when leads are captured across the system!
 */
export async function sendCreatorLeadDigestEmail(
  venue: VenueSettings,
  lead: CapturedLead,
  totalPlatformLeads: number
): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getMasterTransporter();
    await transporter.sendMail({
      from: `"Explore Local SaaS Telemetry" <${MASTER_CREATOR_EMAIL}>`,
      to: MASTER_CREATOR_EMAIL,
      subject: `📊 System Telemetry: New Lead on ${venue.name} (Total System Leads: ${totalPlatformLeads})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          <h2 style="color: #16a34a; margin-top: 0;">📊 SaaS Activity Telemetry Update</h2>
          <p>A new guest lead was captured on your platform!</p>
          <ul style="line-height: 1.8; color: #374151;">
            <li><strong>Venue:</strong> ${venue.name} (/v/${venue.slug})</li>
            <li><strong>Captured Guest Name:</strong> ${lead.name}</li>
            <li><strong>Contact Info:</strong> ${lead.emailOrPhone}</li>
            <li><strong>Total Platform Leads to Date:</strong> ${totalPlatformLeads}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">Sent to Platform Creator: ${MASTER_CREATOR_EMAIL}</p>
        </div>
      `
    });
    return { success: true, message: 'Creator digest alert sent to fouzi.cse@gmail.com' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed digest email' };
  }
}

/**
 * Diagnostic SMTP Test
 */
export async function testSmtpConnection(
  smtp: SmtpConfig
): Promise<{ success: boolean; message: string }> {
  const host = smtp.host || 'smtp.gmail.com';
  const user = smtp.user || MASTER_CREATOR_EMAIL;
  const pass = smtp.pass || MASTER_CREATOR_PASS;

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: smtp.port || 587,
      secure: smtp.secure || false,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });

    await transporter.verify();

    const targetEmail = smtp.notifyEmail || user || MASTER_CREATOR_EMAIL;
    await transporter.sendMail({
      from: `"Explore Local SaaS" <${user}>`,
      to: targetEmail,
      subject: '✅ SMTP Diagnostic Test Email Successful!',
      text: 'Your email server setup is working properly. Automated lead alerts will be delivered to this address.'
    });

    return { success: true, message: `SMTP connection verified! Test email dispatched to ${targetEmail}.` };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Failed to connect to SMTP server.' };
  }
}
