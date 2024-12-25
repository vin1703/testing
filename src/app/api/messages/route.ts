import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  try {
    const messages: string[] = [];

    // Subscribe to the "notifications" channel in Redis
    const subscriber = redis.duplicate(); // Use a duplicate connection for subscribing

    await new Promise((resolve, reject) => {
      subscriber.on('message', (channel, message) => {
        if (channel === 'notifications') {
          messages.push(message);
        }
      });

      // Handle subscription errors
      subscriber.on('error', (err) => {
        reject(err);
      });

      // Subscribe to the channel
      subscriber.subscribe('notifications', (err, count) => {
        if (err) {
          reject(err);
        }
      });

      // Wait for a short period and then unsubscribe
      setTimeout(() => {
        subscriber.unsubscribe(); // Unsubscribe after 5 seconds
        resolve(messages);
      }, 5000);
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
