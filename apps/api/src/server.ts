import dotenv from "dotenv";
import config from "./config";
import app from "./app";


app.listen(config.server.port, () => {
  console.log(`API running on port ${config.server.port}`);
});