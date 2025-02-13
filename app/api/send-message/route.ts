import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  try {
    const { to, from, message } = await request.json();

    // Verify the phone number first
    const verificationCheck = await client.lookups.v2
      .phoneNumbers(from)
      .fetch();

    if (!verificationCheck.valid) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    const response = await client.messages.create({
      body: message,
      from: from, // Use the user's verified phone number
      to: to,
    });

    return NextResponse.json({ success: true, messageId: response.sid });
  } catch (error) {
    console.error('Failed to send message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}