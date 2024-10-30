import express from "express";
import cors from "cors";
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

app.use(cors());
app.use(express.json());

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

// Simula el almacenamiento del access_token (en producción, esto vendría de tu base de datos)
let storedAccessToken: string | null = null;

app.post("/create_link_token", async (req, res) => {
  try {
    const response = await client.linkTokenCreate({
      user: { client_user_id: "user-id" },
      client_name: "Tu Aplicación de Finanzas",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "es",
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creando link token:", error);
    res.status(500).json({ error: "Error creating link token" });
  }
});

app.post("/exchange_public_token", async (req, res) => {
  const { public_token } = req.body;
  try {
    const response = await client.itemPublicTokenExchange({ public_token });
    storedAccessToken = response.data.access_token;
    res.json({ access_token: response.data.access_token });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    res.status(500).json({ error: "Error exchanging public token" });
  }
});

app.post("/set_access_token", (req, res) => {
  const { access_token } = req.body;
  storedAccessToken = access_token;
  res.json({ success: true });
});

app.get("/accounts", async (req, res) => {
  if (!storedAccessToken) {
    res.status(400).json({
      error: "No access token available. Please connect a bank account first.",
    });
  }

  try {
    const response = await client.accountsGet({
      access_token: storedAccessToken ?? "",
    });
    res.json(response.data.accounts);
  } catch (error) {
    console.error("Error obteniendo cuentas:", error);
    res.status(500).json({ error: "Error getting accounts", details: error });
  }
});

app.get("/transactions", async (req, res) => {
  if (!storedAccessToken) {
    res.status(400).json({
      error: "No access token available. Please connect a bank account first.",
    });
  }

  try {
    const now = new Date();
    const oneYearAgo = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );

    const response = await client.transactionsGet({
      access_token: storedAccessToken ?? "",
      start_date: oneYearAgo.toISOString().split("T")[0],
      end_date: now.toISOString().split("T")[0],
    });
    res.json(response.data.transactions);
  } catch (error) {
    console.error("Error obteniendo transacciones:", error);
    res
      .status(500)
      .json({ error: "Error getting transactions", details: error });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
