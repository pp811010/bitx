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

export type User = {
  firstName: string;
  lastName: string;
  assets: Asset[];
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
    image: string
    symbol: string
    current_price: number
    market_cap: number
    price_change_percentage_24h : number
    
}

export type ProfitResult = {
  myCoin: Asset;
  avgPriceCoin: number;      
  hasPriceNow: number;       
  hasPriceHold: number;      
  resultProfit: number;      
  resultProfitPercent: number;
  success : boolean
};


export  type ErrorResponse = {
    message: string;
  };

export type AddCashResult = {
    price?: number;
    success?: boolean;
    message?: string;
    error?: unknown;
  };
  
  export type CreateProfileResult = {
    success?: boolean;
    message?: string;
    profile?: Profile;
    error?: string;
    details?: string;
  };

  export type Profile = {
    id: number;
    clerkId: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  };


  export type Assettotal =   { total: number; profitTotal: number; profitTotalPercent: number }

  