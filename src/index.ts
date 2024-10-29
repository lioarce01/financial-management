import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(cors(corsOptions));

app.use("/", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

export default app;
