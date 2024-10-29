import express from "express";
import cors from "cors";
import router from "./routes";
import * as dotenv from "dotenv";
import {
  Configuration,
  CountryCode,
  PlaidApi,
  PlaidEnvironments,
  Products,
} from "plaid";

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(configuration);

app.post("/create_link_token", async (req, res) => {
  const response = await client.linkTokenCreate({
    user: {
      client_user_id: "user-id",
    },
    client_name: "Tu nombre de aplicación",
    products: [Products.Transactions],
    country_codes: [CountryCode.Us],
    language: "es",
  });
  res.json(response.data);
});

app.post("/exchange_public_token", async (req, res) => {
  const { public_token } = req.body;
  const response = await client.itemPublicTokenExchange({ public_token });
  const access_token = response.data.access_token; // Guarda este token de acceso
  res.json({ access_token });
});

app.use(cors(corsOptions));

app.use("/", router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running in http://localhost:${PORT}`);
});

export default app;
