import redis from "redis";

import CyclicDb from "@cyclic.sh/dynamodb";
const db = CyclicDb("jealous-nightgown-pikeCyclicDB");

let cache;

if (process.env.CACHE === "Redis") {
  (async () => {
    cache = redis.createClient();

    cache.on("error", (error) => console.error(`Error : ${error}`));

    await cache.connect().then(() => console.log("Connected to Redis cache"));
  })();
} else if ((process.env.cache = "DynamoDB")) {
  cache = db.collection("cache");
  console.log("Connected to DynamoDB");
}

export default cache;
