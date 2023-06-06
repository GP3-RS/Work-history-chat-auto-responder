import * as dotenv from "dotenv";
dotenv.config();
import redis from "redis";
// if hosting on Cyclic and using their integrated DynamoDB storage, uncomment the lines below and grab your DynamoDB Table Name from Cyclic's Data/Storage tab and either (1) input it as the argument to the CyclicDB function or (2) input it in your .env with the key DYNAMODBTABLENAME
// import CyclicDb from "@cyclic.sh/dynamodb";
// const db: string = CyclicDb(process.env.DYNAMODBTABLENAME);
let cache;
if (process.env.CACHE === "Redis") {
    (async () => {
        if (process.env.ENV === "Render" && process.env.REDIS_URL)
            cache = redis.createClient({
                url: process.env.REDIS_URL,
            });
        else
            cache = redis.createClient();
        cache.on("error", (error) => console.error(`Redis client error: ${error}`));
        await cache
            .connect()
            .then(() => console.log(`Connected to ${process.env.ENV} Redis cache`));
    })();
}
else if (process.env.CACHE === "DynamoDB") {
    cache = db.collection("cache");
    console.log("Connected to DynamoDB");
}
export default cache;
