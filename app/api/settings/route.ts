import { NextResponse } from 'next/server';
import { getVenueSettings, saveVenueSettings } from '@/lib/storage';
import { sendVenueWelcomeEmail } from '@/lib/email';

export const maxDuration = 60; // Prevent Vercel function timeout (60 seconds max for Hobby tier)

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

    // Save to storage
    saveVenueSettings(body);

    // 1. Send Welcome Email to newly registered Venue Owner
    const welcomeResult = await sendVenueWelcomeEmail(body);

    return NextResponse.json({
      success: true,
      settings: body,
      welcomeEmailStatus: welcomeResult
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to save venue settings.' }, { status: 500 });
  }
}
