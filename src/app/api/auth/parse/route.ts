import { NextResponse } from 'next/server';
import { extractAppointmentDetailsFromTranscript } from '@/lib/gemini';

export async function POST(req: Request) {
  const { transcript } = await req.json();

  if (!transcript) {
    return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
  }

  try {
    const details = await extractAppointmentDetailsFromTranscript(transcript);
    return NextResponse.json({ details });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to parse transcript' }, { status: 500 });
  }
}