import "dotenv/config";
import serverless from "serverless-http";
import connectDB from "../../server/src/config/db.js";
import createApp from "../../server/src/app.js";

await connectDB();
const app = createApp();

export const handler = serverless(app);
