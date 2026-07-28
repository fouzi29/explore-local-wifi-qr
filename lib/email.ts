import nodemailer from 'nodemailer';
import { CapturedLead, VenueSettings } from './storage';

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
 * 1. Welcome Email sent to Venue Owner immediately after registration with QR Code & Portal link
 */
export async function sendVenueWelcomeEmail(
  venue: VenueSettings
): Promise<{ success: boolean; message: string }> {
  const recipientEmail = venue.smtp?.notifyEmail || venue.smtp?.user || MASTER_CREATOR_EMAIL;
  const portalUrl = `https://explore-local-wifi-qr.vercel.app/v/${venue.slug}`;

  try {
    const transporter = getSystemTransporter();
    const info = await transporter.sendMail({
      from: `"WiFiPulse" <${SYSTEM_OUTGOING_EMAIL}>`,
      to: recipientEmail,
      subject: `🎉 Welcome to WiFiPulse! ${venue.name} Portal is Live`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff; color: #111827;">
          
          <div style="border-bottom: 3px solid #16a34a; padding-bottom: 16px; margin-bottom: 20px; text-align: center;">
            <h1 style="color: #0f172a; margin: 0; font-size: 24px;">🎉 Welcome to WiFiPulse!</h1>
            <p style="color: #16a34a; font-weight: bold; margin-top: 6px; font-size: 16px;">Your Venue Portal for <strong>${venue.name}</strong> is Live!</p>
          </div>

          <p style="font-size: 15px; color: #374151; line-height: 1.6;">
            Congratulations! Your QR Wi-Fi Lead Capture Portal has been created successfully. Guests scanning your tabletop QR code can now connect to your Wi-Fi while unlocking your local deals.
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0f172a;">📋 Venue Details:</h3>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Venue Name:</strong> ${venue.name}</p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Portal Link:</strong> <a href="${portalUrl}" style="color: #16a34a; font-weight: bold;">${portalUrl}</a></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Wi-Fi SSID:</strong> <code>${venue.wifi.ssid}</code></p>
            <p style="margin: 6px 0; font-size: 14px;"><strong>Wi-Fi Password:</strong> <code>${venue.wifi.password}</code></p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${portalUrl}" style="background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; font-size: 15px; display: inline-block;">
              Open Live Guest Portal
            </a>
          </div>

          <div style="font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 16px;">
            Sent by WiFiPulse System (${SYSTEM_OUTGOING_EMAIL})
          </div>

        </div>
      `
    });

    console.log('Welcome email dispatched:', info.messageId);
    return { success: true, message: `Welcome email sent to ${recipientEmail} (ID: ${info.messageId})` };
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
            <li><strong>Owner Contact Email:</strong> ${venue.smtp?.notifyEmail || 'Not specified'}</li>
            <li><strong>Portal URL:</strong> <a href="${portalUrl}">${portalUrl}</a></li>
            <li><strong>Wi-Fi SSID:</strong> ${venue.wifi.ssid}</li>
            <li><strong>Registration Time:</strong> ${new Date().toLocaleString()}</li>
          </ul>
          <p style="color: #6b7280; font-size: 12px;">Sent to Platform Creator: ${MASTER_CREATOR_EMAIL}</p>
        </div>
      `
    });
    console.log('Creator alert email dispatched:', info.messageId);
    return { success: true, message: `Creator alert sent to ${MASTER_CREATOR_EMAIL}` };
  } catch (err: any) {
    console.error('Failed to send creator venue alert:', err);
    return { success: false, message: err?.message || 'Failed creator alert' };
  }
}

/**
 * 3. Sends lead notification to venue owner on guest Wi-Fi scan
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
      subject: `🎉 New Wi-Fi Lead Captured: ${lead.name} (${venue.name})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; background-color: #ffffff;">
          <h2 style="color: #16a34a; margin-top: 0;">🎉 New Guest Wi-Fi Lead Captured!</h2>
          <p>Venue: <strong>${venue.name}</strong></p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr><td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Guest Name:</td><td style="padding: 8px 0;">${lead.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Contact Info:</td><td style="padding: 8px 0; color: #16a34a; font-weight: bold;">${lead.emailOrPhone}</td></tr>
            <tr><td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Interests:</td><td style="padding: 8px 0;">${lead.interests.join(', ') || 'General Wi-Fi'}</td></tr>
            <tr><td style="padding: 8px 0; color: #4b5563; font-weight: bold;">Captured At:</td><td style="padding: 8px 0; color: #6b7280; font-size: 13px;">${new Date(lead.createdAt).toLocaleString()}</td></tr>
          </table>
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">Sent by WiFiPulse System (${SYSTEM_OUTGOING_EMAIL})</p>
        </div>
      `
    });
    return { success: true, message: `Lead email sent to ${recipientEmail}` };
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
            <li><strong>Total Platform Leads:</strong> ${totalPlatformLeads}</li>
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
