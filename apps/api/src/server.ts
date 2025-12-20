import config from "./config";
import app from "./app";
import pool from "./db";


pool.query("SELECT NOW()")
.then((res) => {
  console.log("DB Conncted :", res.rows[0].now)
})
.catch((err) => {
  console.error(err)
})


app.listen(config.server.port, () => {
  console.log(`API running on port ${config.server.port}`);
});