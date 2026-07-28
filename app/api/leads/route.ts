import { NextResponse } from 'next/server';
import { getVenueLeads, addCapturedLead, getVenueSettings } from '@/lib/storage';
import { sendLeadNotificationEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId') || 'venue_default';
  const leads = getVenueLeads(venueId);
  return NextResponse.json({ success: true, leads });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { venueId = 'venue_default', name, emailOrPhone, interests = [], marketingConsent = true, deviceType } = body;

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

    // Send optional SMTP lead notification
    const venueSettings = getVenueSettings(venueId);
    let emailStatus = null;
    if (venueSettings && venueSettings.smtp && venueSettings.smtp.enabled) {
      emailStatus = await sendLeadNotificationEmail(venueSettings, lead);
    }

    return NextResponse.json({
      success: true,
      lead,
      emailStatus
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to capture lead.' },
      { status: 500 }
    );
  }
}
