import Redis from 'ioredis';

// Connect to Redis (default connection is to localhost:6379)
const redis = new Redis({
    host: 'redis', // 'redis' is the service name in Docker Compose
    port: 6379
  });

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

redis.on('message', (channel, message) => {
  console.log(`Message received on channel ${channel}: ${message}`);
});

export default redis;
