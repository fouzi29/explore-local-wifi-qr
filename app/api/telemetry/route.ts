import { NextResponse } from 'next/server';
import { getPlatformTelemetry, updatePlatformTelemetry } from '@/lib/storage';

export async function GET() {
  const telemetry = getPlatformTelemetry();
  return NextResponse.json({ success: true, telemetry });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updatePlatformTelemetry(body);
    return NextResponse.json({ success: true, telemetry: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Failed to update telemetry.' }, { status: 500 });
  }
}
