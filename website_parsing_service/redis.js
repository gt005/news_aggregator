import { createClient } from 'redis';

export const client = createClient({
    socket: {
        host: 'redis',
        port: 6379
    }
}
);

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();