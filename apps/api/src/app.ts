import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();


app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "API OK" });
});

app.use(routes);

export default app;
