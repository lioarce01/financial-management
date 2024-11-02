import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Account {
  id: string;
  plaidAccountId: string;
  mask: string;
  name: string;
  officialName?: string;
  subtype: string;
  type: string;
  balance?: number;
  currency?: string;
}

interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  transaction_id: string;
  amount: number;
  iso_currency_code: string;
  date: string;
  name: string;
  merchant_name?: string;
  pending: boolean;
  payment_channel?: string;
  transaction_type?: string;
  logo_url?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PlaidState {
  linkToken: string | null;
  isLinkLoading: boolean;
  linkError: string | null;
  accounts: Account[];
  transactions: Transaction[];
  selectedAccountId: string | null;
  isExchanging: boolean;
  exchangeError: string | null;
}

const initialState: PlaidState = {
  linkToken: null,
  isLinkLoading: false,
  linkError: null,
  accounts: [],
  transactions: [],
  selectedAccountId: null,
  isExchanging: false,
  exchangeError: null,
};

export const plaidSlice = createSlice({
  name: "plaid",
  initialState,
  reducers: {
    setLinkToken: (state, action: PayloadAction<string>) => {
      state.linkToken = action.payload;
      state.linkError = null;
    },
    setLinkLoading: (state, action: PayloadAction<boolean>) => {
      state.isLinkLoading = action.payload;
    },
    setLinkError: (state, action: PayloadAction<string | null>) => {
      state.linkError = action.payload;
      state.linkToken = null;
    },
    setAccounts: (state, action: PayloadAction<Account[]>) => {
      state.accounts = action.payload;
    },
    selectAccount: (state, action: PayloadAction<string>) => {
      state.selectedAccountId = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
    },
    setExchanging: (state, action: PayloadAction<boolean>) => {
      state.isExchanging = action.payload;
    },
    setExchangeError: (state, action: PayloadAction<string | null>) => {
      state.exchangeError = action.payload;
    },
    resetPlaidState: (state) => {
      return initialState;
    },
  },
});

export const {
  setLinkToken,
  setLinkLoading,
  setLinkError,
  setAccounts,
  selectAccount,
  setTransactions,
  setExchanging,
  setExchangeError,
  resetPlaidState,
} = plaidSlice.actions;

export default plaidSlice.reducer;
