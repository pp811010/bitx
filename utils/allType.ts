type TransactionWithAsset = Transaction & { asset: Asset };

export interface FetchTransactionResponse {
    transaction?: TransactionWithAsset[];
    message?: string;
    error?: unknown;
}

export type BuySellResponse = {
  success?: boolean;
  message?: string;
  asset?: Asset;
  error?: unknown;
}

export type Asset = {
  id: number;
  name: string;
  ownerId: number;
  totalSpent: number;
  quantity?: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};

export type Transaction = {
  id: number;
  type: "BUY" | "SELL"; 
  profileId: number;
  assetId: number;
  quantity: number;
  price: number;
  timestamp: Date;
  deletedAt?: Date | null;
};


export interface Coin {
    id: string
    name: string
    symbol: string
    current_price: number
}

export type ProfitResult = {
  myCoin?: Asset;
  avgPriceCoin?: number;      
  hasPriceNow?: number;       
  hasPriceHold?: number;      
  resultProfit?: number;      
  resultProfitPercent?: number;
  success? : boolean
};


export  type ErrorResponse = {
    message: string;
  };