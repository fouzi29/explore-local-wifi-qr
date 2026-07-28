import { NextResponse } from 'next/server';
import { testSmtpConnection } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const smtp = await request.json();
    const result = await testSmtpConnection(smtp);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'SMTP diagnostic test failed.' },
      { status: 500 }
    );
  }
}
