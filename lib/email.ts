import nodemailer from 'nodemailer';
import QRCode from 'qrcode';
import { CapturedLead, VenueSettings } from './storage';
import { encodeWifiParams } from './wifi';

const SYSTEM_OUTGOING_EMAIL = 'fzfemass.1021@gmail.com';
const SYSTEM_OUTGOING_PASS = 'gxspshuwjejecqmc';
const MASTER_CREATOR_EMAIL = 'fouzi.cse@gmail.com';

function getSystemTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: SYSTEM_OUTGOING_EMAIL,
      pass: SYSTEM_OUTGOING_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

/**
 * 1. Welcome Email sent to Venue Owner immediately after registration with Embedded QR Code & Printable Stand Attachment
 */
export async function sendVenueWelcomeEmail(
  venue: VenueSettings
): Promise<{ success: boolean; message: string }> {
  const recipientEmail = venue.smtp?.notifyEmail || venue.smtp?.user || MASTER_CREATOR_EMAIL;
  
  const { s, p } = encodeWifiParams(venue.wifi.ssid, venue.wifi.password);
  const portalUrl = `https://explore-local-wifi-qr.vercel.app/v/${venue.slug}?s=${encodeURIComponent(s)}&p=${encodeURIComponent(p)}`;

  try {
    // Generate high-resolution QR code PNG buffer
    const qrBuffer = await QRCode.toBuffer(portalUrl, {
      width: 500,
      margin: 1,
      color: {
        dark: venue.accentColor || '#16a34a',
        light: '#ffffff'
      }
    });

    // Printable Stand HTML Attachment
    const printableStandHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${venue.name} - Printable Tabletop QR Stand</title>
</head>
<body style="font-family: Arial, sans-serif; background: #090d16; padding: 40px; text-align: center; color: white;">
  <div style="background: white; color: #0f172a; max-width: 440px; margin: 0 auto; padding: 32px; border-radius: 24px; border: 4px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
    <div style="background: #0f172a; color: white; padding: 16px; border-radius: 16px; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 22px; text-transform: uppercase;">${venue.name}</h1>
      <p style="color: #16a34a; font-weight: bold; margin-top: 4px; font-size: 13px;">${venue.tagline || 'Guest Wi-Fi Access'}</p>
    </div>
    
    <h2 style="font-size: 20px; font-weight: 900; margin-top: 10px; color: #0f172a;">FREE HIGH-SPEED WI-FI</h2>
    <p style="color: #64748b; font-size: 12px; margin-bottom: 20px;">Point camera to scan & unlock Wi-Fi access</p>
    
    <div style="background: #f8fafc; padding: 16px; border-radius: 16px; border: 2px solid #e2e8f0; display: inline-block;">
      <img src="cid:qrcode_image" style="width: 220px; height: 220px; display: block; margin: 0 auto; border-radius: 8px;" />
    </div>

    <div style="border-top: 2px solid #e2e8f0; margin-top: 20px; padding-top: 16px; font-size: 13px; color: #334155;">
      <p style="margin: 4px 0;"><strong>Network Name (SSID):</strong> ${venue.wifi.ssid}</p>
      <p style="margin: 4px 0;"><strong>Password:</strong> ${venue.wifi.password}</p>
    </div>
  </div>
</body>
</html>
    `;

    const transporter = getSystemTransporter();
    const info = await transporter.sendMail({
      from: `"WiFiPulse System" <${SYSTEM_OUTGOING_EMAIL}>`,
      to: recipientEmail,
      subject: `🎉 Registration Success: ${venue.name} QR Wi-Fi Portal & Stand Attached`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff; color: #111827;">
          
          <div style="border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; text-align: center;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">🎉 Welcome to WiFiPulse!</h1>
            <p style="color: #16a34a; font-weight: bold; margin-top: 6px; font-size: 16px;">Your Venue Portal for <strong>${venue.name}</strong> is Ready!</p>
          </div>

          <p style="font-size: 15px; color: #374151; line-height: 1.6;">
            Congratulations! Your QR Wi-Fi Lead Capture Portal has been created successfully. Below is your official QR code image and attached printable tabletop stand document!
          </p>

          <!-- EMBEDDED QR CODE IMAGE -->
          <div style="text-align: center; margin: 24px 0; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
            <h3 style="margin-top: 0; color: #0f172a;">📱 Your Official Tabletop QR Code:</h3>
            <img src="cid:qrcode_image" alt="${venue.name} QR Code" style="width: 220px; height: 220px; border-radius: 12px; border: 2px solid #e2e8f0;" />
            <p style="font-size: 13px; color: #64748b; margin-top: 8px;">Point phone camera to test instant scan</p>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f172a;">📋 Venue & Wi-Fi Details:</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Venue Name:</strong> ${venue.name}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Guest Portal Link:</strong> <a href="${portalUrl}" style="color: #16a34a; font-weight: bold;">${portalUrl}</a></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Wi-Fi SSID:</strong> <code>${venue.wifi.ssid}</code></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Wi-Fi Password:</strong> <code>${venue.wifi.password}</code></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Notification Recipient Email:</strong> ${recipientEmail}</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${portalUrl}" style="background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; font-size: 15px; display: inline-block;">
              Open Live Guest Portal
            </a>
          </div>

          <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            Sent automatically by WiFiPulse System (${SYSTEM_OUTGOING_EMAIL})
          </div>

        </div>
      `,
      attachments: [
        {
          filename: `${venue.slug}_qr_code.png`,
          content: qrBuffer,
          cid: 'qrcode_image'
        },
        {
          filename: `${venue.slug}_tabletop_stand.html`,
          content: Buffer.from(printableStandHtml, 'utf-8'),
          contentType: 'text/html'
        }
      ]
    });

    console.log('Welcome email dispatched to', recipientEmail, 'MessageID:', info.messageId);
    return { success: true, message: `Welcome email with attached QR code sent to ${recipientEmail}` };
  } catch (err: any) {
    console.error('Failed to send venue welcome email:', err);
    return { success: false, message: err?.message || 'Failed welcome email' };
  }
}

/**
 * 2. Alert Email sent to Master Creator (fouzi.cse@gmail.com) whenever ANY user registers a venue
 */
export async function sendCreatorVenueAlertEmail(
  venue: VenueSettings
): Promise<{ success: boolean; message: string }> {
  const portalUrl = `https://explore-local-wifi-qr.vercel.app/v/${venue.slug}`;

  try {
    const transporter = getSystemTransporter();
    const info = await transporter.sendMail({
      from: `"WiFiPulse System" <${SYSTEM_OUTGOING_EMAIL}>`,
      to: MASTER_CREATOR_EMAIL,
      subject: `🚨 New System Registration Alert: ${venue.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #0d9488; margin-top: 0;">🚨 New Venue Registered On Your Platform!</h2>
          <p>A new venue owner has set up their portal on your WiFiPulse system.</p>
          <ul style="line-height: 1.8; color: #374151;">
            <li><strong>Venue Name:</strong> ${venue.name}</li>
            <li><strong>Owner Notification Email:</strong> ${venue.smtp?.notifyEmail || 'Not specified'}</li>
            <li><strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a></li>
            <li><strong>Wi-Fi SSID:</strong> ${venue.wifi.ssid}</li>
            <li><strong>Registration Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">Sent to Platform Creator: ${MASTER_CREATOR_EMAIL}</p>
        </div>
      `
    });
    return { success: true, message: `Creator alert sent to ${MASTER_CREATOR_EMAIL}` };
  } catch (err: any) {
    console.error('Failed to send creator venue alert:', err);
    return { success: false, message: err?.message || 'Failed creator alert' };
  }
}

/**
 * 3. Sends lead notification to venue owner on guest Wi-Fi scan with BCC to fouzi.cse@gmail.com
 */
export async function sendVenueLeadEmail(
  venue: VenueSettings,
  lead: CapturedLead
): Promise<{ success: boolean; message: string }> {
  const recipientEmail = venue.smtp?.notifyEmail || MASTER_CREATOR_EMAIL;
  
  try {
    const transporter = getSystemTransporter();
    const info = await transporter.sendMail({
      from: `"${venue.name} Wi-Fi" <${SYSTEM_OUTGOING_EMAIL}>`,
      to: recipientEmail,
      bcc: MASTER_CREATOR_EMAIL, // BCC creator (fouzi.cse@gmail.com) on every lead!
      subject: `⚡ New Guest Wi-Fi Lead Captured: ${lead.name} | WiFiPulse Alert`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff; color: #111827;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 New Guest Wi-Fi Lead Captured!</h2>
          <p>Venue: <strong>${venue.name}</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border-radius: 10px; padding: 12px;">
            <tr><td style="padding: 10px; color: #4b5563; font-weight: bold; width: 35%;">Guest Name:</td><td style="padding: 10px; font-weight: bold; color: #0f172a;">${lead.name}</td></tr>
            <tr><td style="padding: 10px; color: #4b5563; font-weight: bold;">Contact Info:</td><td style="padding: 10px; color: #16a34a; font-weight: bold;">${lead.emailOrPhone}</td></tr>
            <tr><td style="padding: 10px; color: #4b5563; font-weight: bold;">Device Scanner:</td><td style="padding: 10px;">${lead.deviceType || 'Mobile Web Scanner'}</td></tr>
            <tr><td style="padding: 10px; color: #4b5563; font-weight: bold;">Captured At:</td><td style="padding: 10px; color: #6b7280; font-size: 13px;">${new Date(lead.createdAt).toLocaleString()}</td></tr>
          </table>
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">Sent by WiFiPulse System (${SYSTEM_OUTGOING_EMAIL})</p>
        </div>
      `
    });
    console.log('Lead notification email sent to venue owner:', recipientEmail, '(BCC:', MASTER_CREATOR_EMAIL, ') MessageID:', info.messageId);
    return { success: true, message: `Lead email sent to ${recipientEmail} with BCC to ${MASTER_CREATOR_EMAIL}` };
  } catch (error: any) {
    console.error('Failed to send venue lead email:', error);
    return { success: false, message: error?.message || 'SMTP Connection error.' };
  }
}

/**
 * 4. Sends telemetry email to creator on lead capture
 */
export async function sendCreatorLeadDigestEmail(
  venue: VenueSettings,
  lead: CapturedLead,
  totalPlatformLeads: number
): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getSystemTransporter();
    await transporter.sendMail({
      from: `"WiFiPulse Telemetry" <${SYSTEM_OUTGOING_EMAIL}>`,
      to: MASTER_CREATOR_EMAIL,
      subject: `📊 Telemetry: New Lead Captured on ${venue.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
          <h3 style="color: #16a34a; margin-top: 0;">📊 WiFiPulse Telemetry Update</h3>
          <p>A new guest lead was captured on your platform!</p>
          <ul>
            <li><strong>Venue:</strong> ${venue.name} (/v/${venue.slug})</li>
            <li><strong>Guest Name:</strong> ${lead.name}</li>
            <li><strong>Contact:</strong> ${lead.emailOrPhone}</li>
          </ul>
        </div>
      `
    });
    return { success: true, message: 'Digest email sent' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'Digest error' };
  }
}

export async function testSmtpConnection(
  smtp: any
): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getSystemTransporter();
    await transporter.verify();
    return { success: true, message: 'SMTP connection verified successfully!' };
  } catch (err: any) {
    return { success: false, message: err?.message || 'SMTP Connection failed.' };
  }
}
