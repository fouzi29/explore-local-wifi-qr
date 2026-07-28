import { NextResponse } from 'next/server';
import { getVenueLeads, addCapturedLead, getVenueSettings, getVenueBySlug, getPlatformTelemetry } from '@/lib/storage';
import { sendVenueLeadEmail, sendCreatorLeadDigestEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId') || 'venue_default';
  const leads = getVenueLeads(venueId);
  return NextResponse.json({ success: true, leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      venueId = 'venue_default',
      venueName,
      notifyEmail,
      name,
      emailOrPhone,
      interests = [],
      marketingConsent = true,
      deviceType
    } = body;

    if (!name || !emailOrPhone) {
      return NextResponse.json(
        { success: false, error: 'Name and Email/Phone are required.' },
        { status: 400 }
      );
    }

    const lead = addCapturedLead({
      venueId,
      name,
      emailOrPhone,
      interests,
      marketingConsent,
      deviceType: deviceType || 'Mobile Web Scanner'
    });

    // Lookup venue settings by ID or by slug fallback
    let venueSettings = getVenueSettings(venueId);
    if (!venueSettings || !venueSettings.name) {
      const fallbackVenue = getVenueBySlug(venueId);
      if (fallbackVenue) {
        venueSettings = fallbackVenue;
      }
    }

    // Override venue name and notify email if passed from tabletop QR parameters
    if (venueName) {
      venueSettings.name = venueName;
    }
    if (notifyEmail && notifyEmail.trim()) {
      venueSettings.smtp = {
        ...venueSettings.smtp,
        enabled: true,
        notifyEmail: notifyEmail.trim(),
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        user: 'fzfemass.1021@gmail.com',
        pass: 'gxspshuwjejecqmc',
        fromName: `${venueSettings.name} Wi-Fi`,
        fromEmail: 'fzfemass.1021@gmail.com'
      };
    }

    const telemetry = getPlatformTelemetry();

    // 1. Send lead notification email TO THE REGISTERED VENUE OWNER EMAIL (notifyEmail) with BCC to fouzi.cse@gmail.com
    const venueEmailRes = await sendVenueLeadEmail(venueSettings, lead);

    // 2. Send master telemetry alert email to CREATOR (fouzi.cse@gmail.com)
    const creatorEmailRes = await sendCreatorLeadDigestEmail(
      venueSettings,
      lead,
      telemetry.totalLeadsCaptured
    );

    return NextResponse.json({
      success: true,
      lead,
      venueEmailStatus: venueEmailRes,
      creatorEmailStatus: creatorEmailRes
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to capture lead.' },
      { status: 500 }
    );
  }
}
