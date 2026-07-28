import { NextResponse } from 'next/server';
import { getVenueSettings, saveVenueSettings } from '@/lib/storage';
import { sendCreatorVenueAlertEmail } from '@/lib/email';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId') || 'venue_default';
  const settings = getVenueSettings(venueId);
  return NextResponse.json({ success: true, settings });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.id) {
      return NextResponse.json({ success: false, error: 'Invalid venue configuration payload.' }, { status: 400 });
    }

    saveVenueSettings(body);

    // Notify Platform Creator (fouzi.cse@gmail.com) when a venue portal is created/updated
    sendCreatorVenueAlertEmail(body).catch(e => console.error('Creator alert error', e));

    return NextResponse.json({ success: true, settings: body });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to save venue settings.' }, { status: 500 });
  }
}
