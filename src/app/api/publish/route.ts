import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (message) {
      // Publish the message to the "notifications" channel in Redis
      await redis.publish('notifications', message);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error publishing message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
