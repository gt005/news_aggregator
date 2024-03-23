import { createClient } from "redis";
import { redisHost, redisPort } from "./const.js";

export const client = createClient({
    socket: {
        host: redisHost,
        port: redisPort,
    },
});

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect();
