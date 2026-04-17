import dotenv from "dotenv";
import connectDB from "./config/db.js";
import createApp from "./app.js";

dotenv.config();
await connectDB();

const app = createApp();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

